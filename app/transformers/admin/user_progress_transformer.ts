import UserProgress from '#models/user_progress'

export default class UserProgressTransformer {
  public static single(userProgress: UserProgress) {
    return {
      id: userProgress.id,
      userId: userProgress.user_id,
      lessonId: userProgress.lesson_id,
      progressPercent: userProgress.progress_percent,
      createdAt: userProgress.createdAt,
      updatedAt: userProgress.updatedAt,
    }
  }
}
