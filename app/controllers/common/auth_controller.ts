import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      data.password = await hash.use('scrypt').make(data.password)

      const user = await User.create(data)

      return response.status(201).json({
        message: 'User registered successfully',
        data: {
          user,
        },
      })
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({
          errors: error.messages,
        })
      }
      return response.status(500).json({
        message: 'An error occurred during registration',
      })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.query().where('email', email).first()

      if (!user) {
        return response.status(404).json({
          message: 'User not found',
        })
      }

      const passwordVerified = await hash.use('scrypt').verify(user.password, password)

      if (!passwordVerified) {
        return response.status(422).json({
          message: 'Password incorrect',
        })
      }

      const token = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login sucessfully',
        token: token.value!.release(),
        user: user.serialize(),
      })
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({
          errors: error.messages,
        })
      }
      return response.status(500).json({
        message: 'Login failed.',
      })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      if (user.currentAccessToken) {
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      }

      return response.ok({
        message: 'Logout successfully',
      })
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          message: 'Unauthorized',
        })
      }
      return response.internalServerError({
        message: 'Logout failed',
      })
    }
  }
}
