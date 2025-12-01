import UserExercise from '#models/user_exercise'
import Exercise from '#models/exercise'
import { createValidator, updateValidator } from '#validators/client/user_exercise'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserExercisesController {
  public async index({ auth, params, response }: HttpContext) {
    try {
      const authUser = await auth.getUserOrFail()
      const lessonId = Number(params.lessonId)
      const exerciseId = Number(params.exerciseId)

      const attempts = await UserExercise.query()
        .where('user_id', authUser.id)
        .andWhere('lesson_id', lessonId)
        .andWhere('exercise_id', exerciseId)

      return response.ok({
        success: true,
        content: attempts,
      })
    } catch (error) {
      if ((error as any).code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          success: false,
          message: 'Unauthorized',
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to fetch user exercises',
      })
    }
  }

  public async store({ request, auth, params, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createValidator)
      const authUser = await auth.getUserOrFail()
      const lessonId = Number(params.lessonId)
      const exerciseId = Number(params.exerciseId)

      if (payload.userId !== authUser.id) {
        return response.forbidden({
          success: false,
          message: 'You cannot create exercise attempts for another user',
        })
      }

      const exercise = await Exercise.query()
        .where('id', exerciseId)
        .andWhere('lesson_id', lessonId)
        .first()

      if (!exercise) {
        return response.notFound({
          success: false,
          message: 'Exercise not found for this lesson',
        })
      }

      const isCorrect = payload.answer.trim() === exercise.correct_answer

      const attempt = await UserExercise.create({
        user_id: payload.userId,
        lesson_id: lessonId,
        exercise_id: exerciseId,
        answer: payload.answer,
        is_correct: isCorrect,
        is_completed: payload.isComplete,
      })

      return response.status(201).json({
        success: true,
        message: 'User exercise created successfully',
        content: attempt,
      })
    } catch (error) {
      if ((error as any).messages) {
        return response.status(422).json({
          success: false,
          errors: (error as any).messages,
        })
      }

      if ((error as any).code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          success: false,
          message: 'Unauthorized',
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to create user exercise',
      })
    }
  }

  public async show({ params, auth, response }: HttpContext) {
    try {
      const authUser = await auth.getUserOrFail()
      const lessonId = Number(params.lessonId)
      const exerciseId = Number(params.exerciseId)

      const attempt = await UserExercise.query()
        .where('id', params.id)
        .andWhere('user_id', authUser.id)
        .andWhere('lesson_id', lessonId)
        .andWhere('exercise_id', exerciseId)
        .first()

      if (!attempt) {
        return response.notFound({
          success: false,
          message: 'User exercise not found',
        })
      }

      return response.ok({
        success: true,
        content: attempt,
      })
    } catch (error) {
      if ((error as any).code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          success: false,
          message: 'Unauthorized',
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to fetch user exercise',
      })
    }
  }

  public async update({ params, request, auth, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateValidator)
      const authUser = await auth.getUserOrFail()
      const lessonId = Number(params.lessonId)
      const exerciseId = Number(params.exerciseId)

      if (payload.userId !== authUser.id) {
        return response.forbidden({
          success: false,
          message: 'You cannot update exercise attempts for another user',
        })
      }

      const attempt = await UserExercise.query()
        .where('id', params.id)
        .andWhere('user_id', authUser.id)
        .andWhere('lesson_id', lessonId)
        .andWhere('exercise_id', exerciseId)
        .first()

      if (!attempt) {
        return response.notFound({
          success: false,
          message: 'User exercise not found',
        })
      }

      if (typeof payload.isComplete !== 'undefined') {
        attempt.is_completed = payload.isComplete
      }

      await attempt.save()

      return response.ok({
        success: true,
        message: 'User exercise updated successfully',
        content: attempt,
      })
    } catch (error) {
      if ((error as any).messages) {
        return response.status(422).json({
          success: false,
          errors: (error as any).messages,
        })
      }

      if ((error as any).code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          success: false,
          message: 'Unauthorized',
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to update user exercise',
      })
    }
  }
}
