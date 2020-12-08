import { Lifeline, LifelineType, AlienQuestion, Question } from '@/types/types';
import { v4 as uuid } from 'uuid';

export const createNewLifelines = (): Lifeline[] => [
    { type: LifelineType.FiftyFifty, isUsed: false },
    { type: LifelineType.PlusTen, isUsed: false },
];

export const isQuestionUnanswered = ({ userAnswer }: Question) => userAnswer === null;

export const getNextUnansweredQuestion = (questions: Question[]) =>
    questions.find(isQuestionUnanswered) || null;

export const getNoOfUnansweredQuestions = (questions: Question[]) =>
    questions.filter(isQuestionUnanswered).length;

export const normalizeQuestions = (alienQuestions: AlienQuestion[]): Question[] =>
    alienQuestions.map(
        (alienQuestion: AlienQuestion): Question => {
            const {
                category,
                difficulty,
                question,
                correct_answer: correctAnswer,
                incorrect_answers: incorrectAnswers,
            } = alienQuestion;

            return {
                id: uuid(),
                category,
                difficulty,
                question,
                correctAnswer,
                incorrectAnswers,
                userAnswer: null,
            };
        }
    );
