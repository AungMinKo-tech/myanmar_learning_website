import Testimonial from '#models/testimonial'
import type { HttpContext } from '@adonisjs/core/http'
import TestimonialTransformer from '../../transformers/client/testimonial_transformer.js'
import { createValidator } from '#validators/client/testimonial'

export default class TestimonialsController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const testimonials = await Testimonial.query().paginate(page, perPage)

      return response.json({
        success: true,
        content: testimonials
          .all()
          .map((testimonial) => TestimonialTransformer.single(testimonial)),
        meta: {
          total: testimonials.total,
          perPage: testimonials.perPage,
          currentPage: testimonials.currentPage,
          lastPage: testimonials.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch testimonials',
        status: 500,
      })
    }
  }

  public async store({ request, response, auth, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(createValidator)

      const authUser = await auth.getUserOrFail()

      if (Number(params.userId) !== authUser.id) {
        return response.forbidden({
          success: false,
          message: 'You cannot create testimonial for another user',
        })
      }

      const testimonial = await Testimonial.create({
        user_id: authUser.id,
        comment: payload.comment,
      })

      await testimonial.load('user')

      return response.status(201).json({
        success: true,
        message: 'Testimonial created successfully',
        content: TestimonialTransformer.single(testimonial),
      })
    } catch (error) {
      if ((error as any).messages) {
        return response.status(422).json({
          success: false,
          errors: (error as any).messages,
        })
      }

      if ((error as any).code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          success: false,
          message: 'Unauthorized',
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to create testimonial',
      })
    }
  }

  public async destroy({ auth, params, response }: HttpContext) {
    try {
      const authUser = await auth.getUserOrFail()

      const testimonial = await Testimonial.find(params.id)

      if (!testimonial) {
        return response.notFound({
          success: false,
          message: 'Testimonial not found',
          status: 404,
        })
      }

      if (testimonial.user_id !== authUser.id) {
        return response.forbidden({
          success: false,
          message: 'You are not allowed to delete this testimonial',
        })
      }

      await testimonial.delete()

      return response.ok({
        success: true,
        message: 'Testimonial deleted successfully',
        status: 204,
      })
    } catch (error) {
      if ((error as any).code === 'E_UNAUTHORIZED_ACCESS') {
        return response.unauthorized({
          success: false,
          message: 'Unauthorized',
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Failed to delete testimonial',
        status: 500,
      })
    }
  }
}
