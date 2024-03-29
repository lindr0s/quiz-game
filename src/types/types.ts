import { ComputedRef } from 'vue';

export enum QuestionDifficulty {
    Easy = 'EASY',
    Medium = 'MEDIUM',
    Hard = 'HARD',
}

export interface UserAnswer {
    questionId: string;
    time: number;
    isCorrect: boolean;
}

export interface Category {
    id: number;
    name: string;
}

export interface Question {
    id: string;
    category: string;
    difficulty: QuestionDifficulty;
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
}

export interface AlienQuestion {
    category: string;
    type: string;
    difficulty: QuestionDifficulty;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export enum LifelineType {
    FiftyFifty = 'FIFTY_FIFTY',
    PlusTen = 'PLUS_TEN',
}

export interface Lifeline {
    id: string;
    type: LifelineType;
    isUsed: boolean;
    name: string;
}

export enum GameState {
    Finished = 'FINISHED',
    NotStarted = 'NOT_STARTED',
    Playing = 'PLAYING',
}

export interface UseGameState {
    gameState: GameState;
    questions: Question[];
    userAnswers: UserAnswer[];
    lifelines: Lifeline[];
}

export interface UseGame {
    questions: ComputedRef<Question[]>;
    userAnswers: ComputedRef<UserAnswer[]>;
    lifelines: ComputedRef<Lifeline[]>;
    isGamePlaying: ComputedRef<boolean>;
    isGameFinished: ComputedRef<boolean>;
    startGame: () => void;
    endGame: () => void;
    resetGame: () => void;
    consumeLifeline: (lifelineId: string) => void;
    addQuestions: (questions: Question[]) => void;
    addUserAnswer: (answer: UserAnswer) => void;
}

export interface UseQuestionsState {
    questions: Question[];
    categories: Category[];
    error: string;
}

export interface UseQuestions {
    questions: ComputedRef<Question[]>;
    categories: ComputedRef<Category[]>;
    error: ComputedRef<string>;
    fetchQuestions: (categoryId: number) => void;
    fetchCategories: () => void;
}

export interface Statistics {
    noOfCorrectAnswers: number;
    noOfIncorrectAnswers: number;
    noOfUnansweredQuestions: number;
    averageTimePerQuestion: number;
    quickestAnswer: number;
    slowestAnswer: number;
}
