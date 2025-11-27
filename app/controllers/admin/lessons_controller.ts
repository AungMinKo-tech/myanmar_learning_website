import Lesson from '#models/lesson'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/lesson'
import { Difficulty } from '../../enums/difficulty.js'
import LessonTransformer from '../../transformers/admin/lesson_transformer.js'

export default class LessonsController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const lessons = await Lesson.query().paginate(page, perPage)

      return response.ok({
        success: true,
        content: lessons.all().map((lesson) => LessonTransformer.single(lesson)),
        meta: {
          total: lessons.total,
          perPage: lessons.perPage,
          currentPage: lessons.currentPage,
          lastPage: lessons.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch lessons',
        status: 500,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.query().where('id', params.id).first()

      if (!lesson) {
        return response.notFound({
          success: false,
          message: 'Lesson not found',
          status: 404,
        })
      }

      return response.ok({
        success: true,
        content: LessonTransformer.single(lesson),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch lesson',
        status: 500,
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
        chapter: payload.chapter,
      })

      return response.created({
        success: true,
        message: 'Lesson created successfully',
        content: LessonTransformer.single(lesson),
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
        message: 'Failed to create lesson',
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

      const lesson = await Lesson.find(params.id)

      if (!lesson) {
        return response.notFound({
          success: false,
          message: 'Lesson not found',
          status: 404,
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

      if (payload.chapter) {
        lesson.chapter = payload.chapter
      }

      await lesson.save()

      return response.ok({
        success: true,
        message: 'Alphabet updated successfully',
        content: LessonTransformer.single(lesson),
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
        message: 'Failed to update lesson',
        status: 500,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)

      if (!lesson) {
        return response.notFound({
          success: false,
          message: 'Lesson not found',
          status: 404,
        })
      }

      await lesson.delete()

      return response.ok({
        success: true,
        message: 'Lesson deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete lesson',
        status: 500,
      })
    }
  }
}
