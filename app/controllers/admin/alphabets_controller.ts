import type { HttpContext } from '@adonisjs/core/http'

import Alphabet from '#models/alphabet'
import File from '#models/file'
import { createValidator, updateValidator } from '#validators/admin/alphabet'
import AlphabetTransformer from '../../transformers/admin/alphabet_transformer.js'
import Audio from '#models/audio'

export default class AlphabetsController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const alphabets = await Alphabet.query()
        .preload('file')
        .preload('audio')
        .paginate(page, perPage)

      return response.json({
        success: true,
        content: alphabets.all().map((alphabet) => AlphabetTransformer.single(alphabet)),
        meta: {
          total: alphabets.total,
          perPage: alphabets.perPage,
          currentPage: alphabets.currentPage,
          lastPage: alphabets.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch alphabets',
        status: 500,
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
          success: false,
          message: 'Alphabet not found',
          status: 404,
        })
      }

      return response.ok({
        success: true,
        content: AlphabetTransformer.single(alphabet),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch alphabet',
        status: 500,
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createValidator)

      let audioId: number | null = null

      if (payload.audio) {
        const audio = await Audio.create({
          audio_path: payload.audio,
        })

        audioId = audio.id
      }

      const file = await File.create({
        file_path: payload.image,
        file_type: 'alphabet-image',
      })

      const alphabet = await Alphabet.create({
        letter: payload.letter,
        romanized: payload.romanized,
        description: payload.description,
        file_id: file.id,
        audio_id: audioId,
      })

      await alphabet.load('file')
      await alphabet.load('audio')

      return response.created({
        success: true,
        message: 'Alphabet created successfully',
        content: AlphabetTransformer.single(alphabet),
        status: 201,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          success: false,
          errors: error.messages,
          status: 422,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to create alphabet',
        status: 500,
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateValidator)

      if (!Object.keys(payload).length) {
        return response.badRequest({
          success: false,
          message: 'No data provided',
          status: 400,
        })
      }

      const alphabet = await Alphabet.find(params.id)

      if (!alphabet) {
        return response.notFound({
          success: false,
          message: 'Alphabet not found',
          status: 404,
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

      if (payload.audio) {
        alphabet.audio_id = await this.persistAudio(payload.audio, alphabet.audio_id)
      }

      await alphabet.save()
      await alphabet.load('file')
      await alphabet.load('audio')

      return response.ok({
        success: true,
        message: 'Alphabet updated successfully',
        content: AlphabetTransformer.single(alphabet),
        status: 200,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          success: false,
          errors: error.messages,
          status: 422,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to update alphabet',
        status: 500,
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
      const audioId = alphabet.audio_id
      await alphabet.delete()

      if (fileId) {
        const file = await File.find(fileId)
        if (file) {
          await file.delete()
        }
      }

      if (audioId) {
        const audio = await Audio.find(audioId)
        if (audio) {
          await audio.delete()
        }
      }

      return response.ok({
        success: true,
        message: 'Alphabet deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete alphabet',
        status: 500,
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

  private async persistAudio(audioPath: string, existingAudioId?: number | null) {
    if (existingAudioId) {
      const audio = await Audio.find(existingAudioId)
      if (audio) {
        audio.audio_path = audioPath
        await audio.save()
        return audio.id
      }
    }

    const audio = await Audio.create({
      audio_path: audioPath,
    })

    return audio.id
  }
}
