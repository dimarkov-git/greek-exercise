function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function getStoredTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            applyTheme(newTheme);
            setStoredTheme(newTheme);
        });
    }
}

document.addEventListener('DOMContentLoaded', initTheme);
