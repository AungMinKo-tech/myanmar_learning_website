import Lesson from '#models/lesson'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/lesson'
import { Type } from '../enums/lesson_type.js'
import { Difficulty } from '../enums/difficulty.js'

export default class LessonsController {
  public async index({ response }: HttpContext) {
    try {
      const lesson = await Lesson.all()

      return response.ok({
        data: lesson,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch lessons',
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.query().where('id', params.id).first()

      if (!lesson) {
        return response.notFound({
          message: 'Lesson not found',
        })
      }

      return response.ok({
        data: lesson,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch lesson',
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createValidator)

      const lesson = await Lesson.create({
        title: payload.title,
        description: payload.description,
        level: payload.level as Difficulty,
        type: payload.type as Type,
      })

      return response.created({
        message: 'Lesson created successfully',
        data: lesson,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Failed to create lesson',
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

      const lesson = await Lesson.find(params.id)

      if (!lesson) {
        return response.notFound({
          message: 'Lesson not found',
        })
      }

      if (payload.title) {
        lesson.title = payload.title
      }

      if (payload.description) {
        lesson.description = payload.description
      }

      if (payload.description) {
        lesson.description = payload.description
      }

      if (payload.level) {
        lesson.level = payload.level as Difficulty
      }

      if (payload.type) {
        lesson.type = payload.type as Type
      }

      await lesson.save()

      return response.ok({
        message: 'Alphabet updated successfully',
        data: lesson,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Failed to update lesson',
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)

      if (!lesson) {
        return response.notFound({
          message: 'Lesson not found',
        })
      }

      await lesson.delete()

      return response.ok({
        message: 'Lesson deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to delete lesson',
      })
    }
  }
}
