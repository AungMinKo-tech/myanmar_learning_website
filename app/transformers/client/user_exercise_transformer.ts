import UserExercise from '#models/user_exercise'

export default class UserExerciseTransformer {
  public static single(userExercise: UserExercise) {
    return {
      id: userExercise.id,
      exerciseId: userExercise.exercise_id,
      exercise: userExercise.exercise,
      userId: userExercise.user_id,
      user: userExercise.user,
      lessonId: userExercise.lesson_id,
      lesson: userExercise.lesson,
      answer: userExercise.answer,
      isCorrect: userExercise.is_correct,
      createdAt: userExercise.createdAt,
      updatedAt: userExercise.updatedAt,
    }
  }
}
