import User from '#models/user'

export default class UserTransformer {
  public static single(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerifiedAt: user.email_verified_at,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
