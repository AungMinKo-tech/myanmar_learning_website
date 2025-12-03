import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Role middleware to authorize access based on the authenticated user's role.
 *
 * Usage in routes:
 *  - middleware.role('admin')
 *  - middleware.role(['admin', 'user'])
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, roles: string | string[] = []) {
    const { auth, response } = ctx

    const user = auth.user
    if (!user) {
      return response.unauthorized({
        message: 'Unauthenticated',
      })
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (allowedRoles.length === 0) {
      return next()
    }

    if (!allowedRoles.includes(user.role)) {
      return response.forbidden({
        message: 'You are not authorized to access this route',
      })
    }

    return next()
  }
}
