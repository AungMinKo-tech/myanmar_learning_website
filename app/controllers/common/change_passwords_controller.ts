import { changePasswordValidator } from '#validators/change_password'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChangePasswordsController {
  public async changePassword({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(changePasswordValidator)

      const user = auth.getUserOrFail()

      const isPasswordValid = await hash.use('scrypt').verify(user.password, data.currentPassword)

      if (!isPasswordValid) {
        return response.status(422).json({
          message: 'Current password is incorrect',
        })
      }

      user.password = await hash.use('scrypt').make(data.newPassword)
      await user.save()

      return response.ok({
        message: 'Password changed successfully',
      })
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          message: 'Unauthorized',
        })
      }
      if (error.messages) {
        return response.status(422).json({
          errors: error.messages,
        })
      }
      return response.status(500).json({
        message: 'An error occurred while changing password',
      })
    }
  }
}
