import UserProgress from '#models/user_progress'
import type { HttpContext } from '@adonisjs/core/http'
import UserProgressTransformer from '../../transformers/admin/user_progress_transformer.js'

export default class UserProgressesController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const progresses = await UserProgress.query().paginate(page, perPage)

      return response.json({
        success: true,
        content: progresses.all().map((progress) => UserProgressTransformer.single(progress)),
        meta: {
          total: progresses.total,
          perPage: progresses.perPage,
          currentPage: progresses.currentPage,
          lastPage: progresses.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch progresses',
        status: 500,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const progress = await UserProgress.query().where('id', params.id).first()

      if (!progress) {
        return response.notFound({
          success: false,
          message: 'Progress not found',
          status: 404,
        })
      }

      return response.json({
        success: true,
        content: UserProgressTransformer.single(progress),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch progress',
        status: 500,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const progress = await UserProgress.find(params.id)

      if (!progress) {
        return response.notFound({
          success: false,
          message: 'Progress not found',
          status: 404,
        })
      }

      await progress.delete()

      return response.ok({
        success: true,
        message: 'Progress deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete progress',
        status: 500,
      })
    }
  }
}
