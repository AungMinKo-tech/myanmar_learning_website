import Exercise from '#models/exercise'

export default class ExerciseTransformer {
  public static single(exercise: Exercise) {
    return {
      id: exercise.id,
      lessonId: exercise.lesson_id,
      lesson: exercise.lesson,
      question: exercise.question,
      type: exercise.type,
      correctAnswer: exercise.correct_answer,
      choices: exercise.choices,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    }
  }
}
