import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '../../transformers/admin/user_transformer.js'

export default class UsersController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const users = await User.query().paginate(page, perPage)

      return response.json({
        success: true,
        content: users.all().map((user) => UserTransformer.single(user)),
        meta: {
          total: users.total,
          perPage: users.perPage,
          currentPage: users.currentPage,
          lastPage: users.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch users',
        status: 500,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const user = await User.query().where('id', params.id).first()

      if (!user) {
        return response.notFound({
          success: false,
          message: 'User not found',
          status: 404,
        })
      }

      return response.ok({
        success: true,
        content: UserTransformer.single(user),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch user',
        status: 500,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          success: false,
          message: 'User not found',
          status: 404,
        })
      }

      await user.delete()

      return response.ok({
        success: true,
        message: 'User deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete user',
        status: 500,
      })
    }
  }
}
