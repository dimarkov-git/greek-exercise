let exercises = [];

async function loadExercises() {
    try {
        const response = await fetch('data/exercises.json');
        if (!response.ok) {
            throw new Error(`Failed to load exercises: ${response.status}`);
        }
        exercises = await response.json();
    } catch (error) {
        console.error('Error loading exercises:', error);
        exercises = [];
    }
}

function renderExercises() {
    const moduleGrid = document.getElementById('module-grid');

    if (!moduleGrid) {
        console.error('Module grid element not found');
        return;
    }

    moduleGrid.innerHTML = '';

    const enabledExercises = exercises.filter(exercise => exercise.enabled);

    if (enabledExercises.length === 0) {
        moduleGrid.innerHTML = '<p style="text-align: center; color: #666;">Δεν υπάρχουν διαθέσιμες ασκήσεις αυτή τη στιγμή.</p>';
        return;
    }

    enabledExercises.forEach(exercise => {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <h3>${exercise.title}</h3>
            <p>${exercise.description}</p>
            <button class="btn-primary">
                ${exercise.buttonText}
            </button>
        `;
        card.addEventListener('click', () => {
            window.location.href = exercise.url;
        });
        moduleGrid.appendChild(card);
    });
}

async function initializeExercises() {
    await loadExercises();
    renderExercises();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExercises);
} else {
    initializeExercises();
}
