import vine from '@vinejs/vine'
import { Difficulty } from '../../enums/difficulty.js'

export const createValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().trim(),
    level: vine.enum(Object.values(Difficulty) as [string]),
    chapter: vine.string().trim(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    level: vine.enum(Object.values(Difficulty) as [string]).optional(),
    chapter: vine.string().trim().optional(),
  })
)
