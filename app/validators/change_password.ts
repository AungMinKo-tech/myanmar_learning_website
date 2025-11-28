import vine from '@vinejs/vine'

export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().trim().minLength(8),
    newPassword: vine.string().trim().minLength(8),
    confirmPassword: vine
      .string()
      .trim()
      .minLength(8)
      .confirmed({ confirmationField: 'newPassword' }),
  })
)
