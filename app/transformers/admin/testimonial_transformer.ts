import Testimonial from '#models/testimonial'

export default class TestimonialTransformer {
  public static single(testimonial: Testimonial) {
    return {
      id: testimonial.id,
      userId: testimonial.user_id,
      user: testimonial.user,
      comment: testimonial.comment,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
    }
  }
}
