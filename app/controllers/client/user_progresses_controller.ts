import Exercise from '#models/exercise'
import UserExercise from '#models/user_exercise'
import type { HttpContext } from '@adonisjs/core/http'

type CountResult = { total: string | number }
type CompletedCountResult = { completed: string | number }

export default class UserProgressesController {
  public async index({ response, auth, params }: HttpContext) {
    try {
      const authUser = await auth.getUserOrFail()
      const userId = authUser.id
      const lessonId = Number(params.lessonId)

      const totalExerciseResult = await Exercise.query()
        .where('lesson_id', lessonId)
        .count('* as total')

      const completedExerciseResult = await UserExercise.query()
        .where('user_id', userId)
        .whereHas('exercise', (q) => {
          q.where('lesson_id', lessonId)
        })
        .where('is_completed', true)
        .count('* as completed')

      const totalCountRow = totalExerciseResult[0] as unknown as CountResult
      const completedCountRow = completedExerciseResult[0] as unknown as CompletedCountResult

      const total = totalCountRow ? Number(totalCountRow.total) : 0
      const completed = completedCountRow ? Number(completedCountRow.completed) : 0

      const progress = total > 0 ? Math.round((completed / total) * 100) : 0

      return response.status(200).json({
        success: true,
        content: {
          lessonId: lessonId,
          progress: progress,
        },
      })
    } catch (error) {
      const errorMessage = error.message || 'Internal Server Error'

      return response.internalServerError({
        success: false,
        message: errorMessage,
      })
    }
  }
}
