import Exercise from '#models/exercise'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/exercise'
import { Type } from '../enums/lesson_type.js'

export default class ExercisesController {
  public async index({ response }: HttpContext) {
    try {
      const exercise = await Exercise.all()

      return response.ok({
        data: exercise,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch exercises',
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.query().where('id', params.id).first()

      if (!exercise) {
        return response.notFound({
          message: 'Exercise not found',
        })
      }

      return response.ok({
        data: exercise,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch exercise',
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
        message: 'Exercise created successfully',
        data: exercise,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Failed to create exercise',
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

      const exercise = await Exercise.find(params.id)

      if (!exercise) {
        return response.notFound({
          message: 'Exercise not found',
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

      return response.ok({
        message: 'Alphabet updated successfully',
        data: exercise,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Failed to update exercise',
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.find(params.id)

      if (!exercise) {
        return response.notFound({
          message: 'Exercise not found',
        })
      }

      await exercise.delete()

      return response.ok({
        message: 'Exercise deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to delete exercise',
      })
    }
  }
}
