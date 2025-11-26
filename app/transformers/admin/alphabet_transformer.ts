import Alphabet from '#models/alphabet'

export default class AlphabetTransformer {
  public static single(alphabet: Alphabet) {
    return {
      id: alphabet.id,
      letter: alphabet.letter,
      romanized: alphabet.romanized,
      description: alphabet.description,
      fileId: alphabet.file_id,
      file: alphabet.file,
      audioId: alphabet.audio_id,
      audio: alphabet.audio,
      createdAt: alphabet.createdAt,
      updatedAt: alphabet.updatedAt,
    }
  }
}
