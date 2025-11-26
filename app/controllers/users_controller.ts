import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async index({ response }: HttpContext) {
    try {
      const user = await User.all()

      return response.ok({
        data: user,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch users',
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const user = await User.query().where('id', params.id).first()

      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      return response.ok({
        data: user,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch user',
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      await user.delete()

      return response.ok({
        message: 'User deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to delete user',
      })
    }
  }
}
