import Exercise from '#models/exercise'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/exercise'
import { Type } from '../../enums/lesson_type.js'
import ExerciseTransformer from '../../transformers/admin/exercise_transformer.js'

export default class ExercisesController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const exercises = await Exercise.query().paginate(page, perPage)

      return response.json({
        success: true,
        content: exercises.all().map((exercise) => ExerciseTransformer.single(exercise)),
        meta: {
          total: exercises.total,
          perPage: exercises.perPage,
          currentPage: exercises.currentPage,
          lastPage: exercises.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch exercises',
        status: 500,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.query().where('id', params.id).first()

      if (!exercise) {
        return response.notFound({
          success: false,
          message: 'Exercise not found',
          status: 404,
        })
      }

      return response.json({
        success: true,
        content: ExerciseTransformer.single(exercise),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch exercise',
        status: 500,
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createValidator)

      const exercise = await Exercise.create({
        lesson_id: payload.lesson_id,
        question: payload.question,
        type: payload.type as Type,
        correct_answer: payload.correct_answer,
      })

      return response.created({
        success: true,
        message: 'Exercise created successfully',
        content: ExerciseTransformer.single(exercise),
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
        message: 'Failed to create exercise',
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

      const exercise = await Exercise.find(params.id)

      if (!exercise) {
        return response.notFound({
          success: false,
          message: 'Exercise not found',
          status: 404,
        })
      }

      if (payload.lesson_id) {
        exercise.lesson_id = payload.lesson_id
      }

      if (payload.question) {
        exercise.question = payload.question
      }

      if (payload.type) {
        exercise.type = payload.type as Type
      }

      if (payload.correct_answer) {
        exercise.correct_answer = payload.correct_answer
      }

      await exercise.save()

      return response.json({
        success: true,
        message: 'Alphabet updated successfully',
        content: ExerciseTransformer.single(exercise),
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
        message: 'Failed to update exercise',
        status: 500,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.find(params.id)

      if (!exercise) {
        return response.notFound({
          success: false,
          message: 'Exercise not found',
          status: 404,
        })
      }

      await exercise.delete()

      return response.ok({
        success: true,
        message: 'Exercise deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete exercise',
        status: 500,
      })
    }
  }
}
