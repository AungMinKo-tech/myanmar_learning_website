import vine from '@vinejs/vine'
import { Type } from '../enums/lesson_type.js'
import { Difficulty } from '../enums/difficulty.js'

export const createValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().trim(),
    level: vine.enum(Object.values(Difficulty) as [string]),
    type: vine.enum(Object.values(Type) as [string]),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    level: vine.enum(Object.values(Difficulty) as [string]).optional(),
    type: vine.enum(Object.values(Type) as [string]).optional(),
  })
)
