import vine from '@vinejs/vine'
import { Type } from '../../enums/lesson_type.js'

export const createValidator = vine.compile(
  vine.object({
    lessonId: vine.number(),
    question: vine.string(),
    type: vine.enum(Object.values(Type) as [string]),
    correctAnswer: vine.string(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    lessonId: vine.number().optional(),
    question: vine.string().optional(),
    type: vine.enum(Object.values(Type) as [string]).optional(),
    correctAnswer: vine.string().optional(),
  })
)
