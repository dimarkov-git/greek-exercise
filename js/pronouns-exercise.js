import { loadExercise } from './exercise-loader.js';

function processData(data) {
    const exercises = [];
    data.forEach(block => {
        block.cases.forEach(blockCase => {
            exercises.push({
                blockName: block.name,
                blockNameI18n: block.nameI18n,
                prompt: blockCase.prompt,
                promptI18n: blockCase.promptI18n,
                correct: blockCase.correct,
            });
        });
    });
    return exercises;
}

loadExercise('../data/pronouns.json', processData);
