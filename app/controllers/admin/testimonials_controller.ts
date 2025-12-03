import Testimonial from '#models/testimonial'
import type { HttpContext } from '@adonisjs/core/http'
import TestimonialTransformer from '../../transformers/admin/testimonial_transformer.js'

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

  public async show({ params, response }: HttpContext) {
    try {
      const testimonial = await Testimonial.query().where('id', params.id).first()

      if (!testimonial) {
        return response.notFound({
          success: false,
          message: 'Testimonial not found',
          status: 404,
        })
      }

      return response.ok({
        success: true,
        content: TestimonialTransformer.single(testimonial),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch testimonial',
        status: 500,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const testimonial = await Testimonial.find(params.id)

      if (!testimonial) {
        return response.notFound({
          success: false,
          message: 'Testimonial not found',
          status: 404,
        })
      }

      await testimonial.delete()

      return response.ok({
        success: true,
        message: 'Testimonial deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete testimonial',
        status: 500,
      })
    }
  }
}
