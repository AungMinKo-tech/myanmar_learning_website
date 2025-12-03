import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

// Middleware to handle user ID related logic
export default class UserIdMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { auth, params, response } = ctx

    const id = auth.user?.id

    if (!id) {
      return response.unauthorized({
        message: 'Unauthenticated',
      })
    }

    const userId = params.userId

    if (userId && Number(userId) !== id) {
      return response.forbidden({
        message: 'You are not authorized to access this resource',
      })
    }

    return next()
  }
}
