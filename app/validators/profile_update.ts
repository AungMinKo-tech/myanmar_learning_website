import vine from '@vinejs/vine'

export const profileUpdateValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine.string().email(),
    profile: vine.file().optional(),
  })
)
