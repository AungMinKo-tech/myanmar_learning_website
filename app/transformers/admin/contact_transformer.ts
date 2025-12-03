import Contact from '#models/contact'

export default class ContactTransformer {
  public static single(contact: Contact) {
    return {
      id: contact.id,
      userId: contact.user_id,
      user: contact.user,
      comment: contact.message,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }
  }
}
