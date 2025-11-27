import UserExercise from '#models/user_exercise'
import type { HttpContext } from '@adonisjs/core/http'
import UserExerciseTransformer from '../../transformers/admin/user_exercise_transformer.js'

export default class UserExercisesController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const userExercises = await UserExercise.query().paginate(page, perPage)

      return response.json({
        success: true,
        content: userExercises
          .all()
          .map((userExercise) => UserExerciseTransformer.single(userExercise)),
        meta: {
          total: userExercises.total,
          perPage: userExercises.perPage,
          currentPage: userExercises.currentPage,
          lastPage: userExercises.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch users exercise',
        status: 500,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const userExercise = await UserExercise.query().where('id', params.id).first()

      if (!userExercise) {
        return response.notFound({
          success: false,
          message: 'User exercise not found',
          status: 404,
        })
      }

      return response.ok({
        success: true,
        content: UserExerciseTransformer.single(userExercise),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch user exercise',
        status: 500,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const userExercise = await UserExercise.find(params.id)

      if (!userExercise) {
        return response.notFound({
          success: false,
          message: 'User not found',
          status: 404,
        })
      }

      await userExercise.delete()

      return response.ok({
        success: true,
        message: 'User exercise deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete user exercise',
        status: 500,
      })
    }
  }
}
