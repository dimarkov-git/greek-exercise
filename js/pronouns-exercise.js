const dataFile = '../data/pronouns.json';

async function loadPronounData() {
    try {
        const response = await fetch(dataFile);
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

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

let exerciseEngine;

document.addEventListener('DOMContentLoaded', async () => {
    const language = localStorage.getItem('selectedLanguage') || 'en';

    const pronounData = await loadPronounData();
    exerciseEngine = new ExerciseEngine(pronounData, processData, language);
    exerciseEngine.start();
});
