import Lesson from '#models/lesson'

export default class LessonTransformer {
  public static single(lesson: Lesson) {
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      level: lesson.level,
      type: lesson.type,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    }
  }
}
