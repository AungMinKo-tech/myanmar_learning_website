import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    answer: vine.string(),
    isComplete: vine.boolean(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    answer: vine.string().optional(),
    isComplete: vine.boolean().optional(),
  })
)
