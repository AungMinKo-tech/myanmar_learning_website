import User from '#models/user'
import { profileUpdateValidator } from '#validators/profile_update'
import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import { mkdir, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'

export default class ProfileUpdatesController {
  public async update({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(profileUpdateValidator)
      const authUser = await auth.getUserOrFail()
      const user = await User.findBy('email', authUser.email)
      const profile = request.file('profile')

      if (!user) {
        return response.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      if (data.name !== user.name) {
        user.name = data.name
      }

      if (data.email !== user.email) {
        user.email = data.email
        if (user.email_verified_at !== null) {
          user.email_verified_at = null
        }
      }

      if (profile) {
        const uploadsDir = app.tmpPath('uploads/profile')
        await mkdir(uploadsDir, { recursive: true })

        if (user.profile) {
          const previousFile = join(uploadsDir, user.profile)
          try {
            await stat(previousFile)
            await unlink(previousFile)
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
              throw error
            }
          }
        }

        const fileName = `${Date.now()}.${profile.extname}`

        await profile.move(uploadsDir, {
          name: fileName,
        })

        user.profile = fileName
      }

      await user.save()

      return response.status(200).json({
        success: true,
        message: 'Profile updated',
        content: {
          name: user.name,
          email: user.email,
          profile: user.profile,
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Unable to update profile',
      })
    }
  }
}
