export type LocalizedTitle = {
  en: string;
  vi: string;
};

export type Choice = {
  id: string;
  text: string;
};

export type Pronunciation =
  | {
      kind: "tts";
      text: string;
      lang: "en-US";
    }
  | {
      kind: "audio";
      src: string;
    };

export type VocabularyItem = {
  id: string;
  word: string;
  meaningVi: string;
  exampleEn: string;
  imageSrc: string;
  imageAltVi: string;
  pronunciation: Pronunciation;
};

export type PracticeQuestion = {
  id: string;
  instructionVi: string;
  sentenceEn: string;
  options: Choice[];
  correctOptionId: string;
  explanationVi: string;
};

export type GrammarLesson = {
  id: string;
  title: LocalizedTitle;
  explanationVi: string;
  rule: string;
  examplesEn: string[];
  practice: PracticeQuestion[];
};

type QuizQuestionBase = {
  id: string;
  instructionVi: string;
  options: Choice[];
  correctOptionId: string;
  explanationVi: string;
};

export type MeaningChoiceQuestion = QuizQuestionBase & {
  type: "meaning-choice";
  wordId: string;
  word: string;
};

export type ImageChoiceQuestion = QuizQuestionBase & {
  type: "image-choice";
  imageSrc: string;
  imageAltVi: string;
};

export type GrammarChoiceQuestion = QuizQuestionBase & {
  type: "grammar-choice";
  sentenceEn: string;
};

export type QuizQuestion =
  | MeaningChoiceQuestion
  | ImageChoiceQuestion
  | GrammarChoiceQuestion;

export type UnitContent = {
  id: string;
  slug: string;
  title: LocalizedTitle;
  descriptionVi: string;
  level: "A1";
  vocabulary: VocabularyItem[];
  grammar: GrammarLesson;
  quizBank: QuizQuestion[];
  rewards: {
    vocabulary: 10;
    grammar: 10;
    quiz: 20;
  };
  quizRules: {
    questionsPerAttempt: 7;
    passPercent: 70;
  };
};

function assertUniqueIds(items: { id: string }[], label: string) {
  const ids = items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label} phải có id duy nhất.`);
  }
}

function assertCorrectOption(
  question: Pick<PracticeQuestion, "id" | "options" | "correctOptionId">,
) {
  if (!question.options.some((option) => option.id === question.correctOptionId)) {
    throw new Error(`Câu ${question.id} có đáp án đúng không nằm trong options.`);
  }
}

export function validateUnitContent(unit: UnitContent): UnitContent {
  if (unit.vocabulary.length !== 5) {
    throw new Error(`${unit.id} phải có đúng 5 từ vựng.`);
  }
  if (unit.grammar.practice.length !== 3) {
    throw new Error(`${unit.id} phải có đúng 3 câu luyện ngữ pháp.`);
  }
  if (unit.quizBank.length !== 10) {
    throw new Error(`${unit.id} phải có đúng 10 câu quiz.`);
  }

  assertUniqueIds(unit.vocabulary, "Từ vựng");
  assertUniqueIds(unit.grammar.practice, "Câu luyện ngữ pháp");
  assertUniqueIds(unit.quizBank, "Câu quiz");

  unit.grammar.practice.forEach(assertCorrectOption);
  unit.quizBank.forEach(assertCorrectOption);

  const quizTypes = new Set(unit.quizBank.map((question) => question.type));
  const requiredTypes: QuizQuestion["type"][] = [
    "meaning-choice",
    "image-choice",
    "grammar-choice",
  ];
  if (!requiredTypes.every((type) => quizTypes.has(type))) {
    throw new Error(`${unit.id} phải có đủ ba dạng câu quiz.`);
  }

  return unit;
}
