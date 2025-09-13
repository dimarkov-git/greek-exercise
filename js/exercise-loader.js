export function loadExercise(dataFile, processData) {
    async function init() {
        try {
            const response = await fetch(dataFile);
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.status}`);
            }
            const data = await response.json();
            const language = localStorage.getItem('selectedLanguage') || 'en';
            const engine = new ExerciseEngine(data, processData, language);
            engine.start();
            return engine;
        } catch (error) {
            console.error('Error initializing exercise:', error);
            return null;
        }
    }

    if (document.readyState === 'loading') {
        return new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', async () => {
                resolve(await init());
            });
        });
    }

    return init();
}
