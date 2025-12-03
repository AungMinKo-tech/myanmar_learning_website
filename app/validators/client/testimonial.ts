import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    comment: vine.string(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    comment: vine.string().optional(),
  })
)
