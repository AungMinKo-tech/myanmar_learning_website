import Contact from '#models/contact'
import type { HttpContext } from '@adonisjs/core/http'
import ContactTransformer from '../../transformers/admin/contact_transformer.js'

export default class ContactsController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const perPage = Number(request.input('perPage', 10))

      const contacts = await Contact.query().paginate(page, perPage)

      return response.json({
        success: true,
        content: contacts.all().map((contact) => ContactTransformer.single(contact)),
        meta: {
          total: contacts.total,
          perPage: contacts.perPage,
          currentPage: contacts.currentPage,
          lastPage: contacts.lastPage,
        },
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch contacts',
        status: 500,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const contact = await Contact.query().where('id', params.id).first()

      if (!contact) {
        return response.notFound({
          success: false,
          message: 'Contact not found',
          status: 404,
        })
      }

      return response.ok({
        success: true,
        content: ContactTransformer.single(contact),
        status: 200,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch contact',
        status: 500,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const contact = await Contact.find(params.id)

      if (!contact) {
        return response.notFound({
          success: false,
          message: 'Contact not found',
          status: 404,
        })
      }

      await contact.delete()

      return response.ok({
        success: true,
        message: 'Contact deleted successfully',
        status: 204,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete contact',
        status: 500,
      })
    }
  }
}
