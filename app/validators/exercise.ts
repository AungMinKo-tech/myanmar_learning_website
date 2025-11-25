import vine from '@vinejs/vine'
import { Type } from '../enums/lesson_type.js'

export const createValidator = vine.compile(
  vine.object({
    lesson_id: vine.number(),
    question: vine.string(),
    type: vine.enum(Object.values(Type) as [string]),
    correct_answer: vine.string(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    lesson_id: vine.number().optional(),
    question: vine.string().optional(),
    type: vine.enum(Object.values(Type) as [string]).optional(),
    correct_answer: vine.string().optional(),
  })
)
