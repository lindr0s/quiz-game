<template>
    <h1 class="is-size-1 has-text-weight-bold has-text-centered">
        Question #{{ questionIndex + 1 }}
    </h1>
    <countdown-bar
        :max="timerMaxMilliSeconds"
        :key="questionIndex"
        @timeout="onTimeout"
        @tick="onTick"
    />
    <question-card
        v-if="currentQuestion"
        :question="currentQuestion.question"
        :answers="answers"
        @answered="onAnswered"
    />
    <lifeline-area class="mt-3" :lifelines="lifelines" @lifeline="onLifelineUsed" />
</template>

<script>
import { computed, ref } from 'vue';
import { shuffle } from 'lodash';
import { GAME_SUMMARY, router } from '@/router';
import useGame from '@/composables/useGame';
import QuestionCard from '../components/QuestionCard.vue';
import CountdownBar from '@/components/CountdownBar.vue';
import LifelineArea from '@/components/LifelineArea.vue';
import { getRoundedTime, isFiftyFiftyLifeline, isPlusTenLifeline } from '@/utils/game';

const TIME_LIMIT_SECONDS = 15;
const TEN_SECONDS = 10;
const ONE_S_IN_MS = 1000;

export default {
    components: { QuestionCard, CountdownBar, LifelineArea },
    setup() {
        const { questions, addUserAnswer, endGame, lifelines, consumeLifeline } = useGame();
        const questionIndex = ref(0);
        const currentQuestion = computed(() => questions.value[questionIndex.value]);
        const timerElapsedMilliSeconds = ref(0);
        const timerMaxMilliSeconds = ref(TIME_LIMIT_SECONDS * 1000);

        // Advance question or end game
        const doNextQuestion = () => {
            timerMaxMilliSeconds.value = TIME_LIMIT_SECONDS * 1000;
            if (questionIndex.value + 1 < questions.value.length) {
                // Show next question. This also resets the counter since it is remounted
                // due to it having a "key" attribute bound to the question index.
                questionIndex.value++;
            } else {
                endGame();
                router.push({ name: GAME_SUMMARY });
            }
        };

        // Compile the answers and shuffle them
        const answers = computed(() =>
            shuffle([
                currentQuestion.value.correctAnswer,
                ...currentQuestion.value.incorrectAnswers,
            ])
        );

        // User clicked on an answer
        const onAnswered = (userChoice) => {
            addUserAnswer({
                questionId: currentQuestion.value.id,
                isCorrect: currentQuestion.value.correctAnswer === userChoice,
                // TODO: Round the time when presenting instead
                time: getRoundedTime(timerElapsedMilliSeconds.value / ONE_S_IN_MS),
            });
            doNextQuestion();
        };

        // Lifeline was used
        const onLifelineUsed = (lifeline) => {
            if (isFiftyFiftyLifeline(lifeline)) {
                currentQuestion.value.incorrectAnswers = currentQuestion.value.incorrectAnswers.slice(
                    2
                );
            } else if (isPlusTenLifeline(lifeline)) {
                timerMaxMilliSeconds.value += TEN_SECONDS * ONE_S_IN_MS;
            }
            // TODO: We don't need to use an id. Just type.
            consumeLifeline(lifeline.id);
        };

        // Keep track of elapsed time for statistics
        const onTick = (elapsed) => (timerElapsedMilliSeconds.value = elapsed);
        // Time ran out, user didn't answer on time
        const onTimeout = () => doNextQuestion();

        return {
            currentQuestion,
            answers,
            onAnswered,
            onTick,
            onTimeout,
            onLifelineUsed,
            questionIndex,
            timerElapsedMilliSeconds,
            timerMaxMilliSeconds,
            lifelines,
        };
    },
};
</script>
