import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    letter: vine.string().trim(),
    romanized: vine.string().trim(),
    description: vine.string().trim(),
    image: vine.string().trim(),
    audio: vine.string().trim().optional(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    letter: vine.string().trim().optional(),
    romanized: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    image: vine.string().trim().optional(),
    audio: vine.string().trim().optional(),
  })
)
