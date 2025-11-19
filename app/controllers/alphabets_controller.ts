import type { HttpContext } from '@adonisjs/core/http'

import Alphabet from '#models/alphabet'
import File from '#models/file'
import { createValidator, updateValidator } from '#validators/alphabet'

export default class AlphabetsController {
  public async index({ response }: HttpContext) {
    try {
      const alphabets = await Alphabet.query().preload('file').preload('audio')

      return response.ok({
        data: alphabets,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch alphabets',
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const alphabet = await Alphabet.query()
        .where('id', params.id)
        .preload('file')
        .preload('audio')
        .first()

      if (!alphabet) {
        return response.notFound({
          message: 'Alphabet not found',
        })
      }

      return response.ok({
        data: alphabet,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch alphabet',
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createValidator)

      const file = await File.create({
        file_path: payload.image,
        file_type: 'alphabet-image',
      })

      const alphabet = await Alphabet.create({
        letter: payload.letter,
        romanized: payload.romanized,
        description: payload.description,
        file_id: file.id,
      })

      await alphabet.load('file')
      await alphabet.load('audio')

      return response.created({
        message: 'Alphabet created successfully',
        data: alphabet,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Failed to create alphabet',
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateValidator)

      if (!Object.keys(payload).length) {
        return response.badRequest({
          message: 'No data provided',
        })
      }

      const alphabet = await Alphabet.find(params.id)

      if (!alphabet) {
        return response.notFound({
          message: 'Alphabet not found',
        })
      }

      if (payload.letter) {
        alphabet.letter = payload.letter
      }

      if (payload.romanized) {
        alphabet.romanized = payload.romanized
      }

      if (payload.description) {
        alphabet.description = payload.description
      }

      if (payload.image) {
        alphabet.file_id = await this.persistImage(payload.image, alphabet.file_id)
      }

      await alphabet.save()
      await alphabet.load('file')
      await alphabet.load('audio')

      return response.ok({
        message: 'Alphabet updated successfully',
        data: alphabet,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Failed to update alphabet',
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const alphabet = await Alphabet.find(params.id)

      if (!alphabet) {
        return response.notFound({
          message: 'Alphabet not found',
        })
      }

      const fileId = alphabet.file_id
      await alphabet.delete()

      if (fileId) {
        const file = await File.find(fileId)
        if (file) {
          await file.delete()
        }
      }

      return response.ok({
        message: 'Alphabet deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to delete alphabet',
      })
    }
  }

  private async persistImage(imagePath: string, existingFileId?: number | null) {
    if (existingFileId) {
      const file = await File.find(existingFileId)
      if (file) {
        file.file_path = imagePath
        file.file_type = 'alphabet-image'
        await file.save()
        return file.id
      }
    }

    const file = await File.create({
      file_path: imagePath,
      file_type: 'alphabet-image',
    })

    return file.id
  }
}
