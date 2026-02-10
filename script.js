const noteArea = document.getElementById('note-area');
const statusSpan = document.getElementById('status');
const clearBtn = document.getElementById('clear-btn');

const STORAGE_KEY = 'simple_notepad_content';

// Load saved note on startup
function loadNote() {
    const savedNote = localStorage.getItem(STORAGE_KEY);
    if (savedNote) {
        noteArea.value = savedNote;
    }
}

// Save note to local storage
function saveNote() {
    localStorage.setItem(STORAGE_KEY, noteArea.value);
    showStatus('Saved');
}

// Show status message temporarily
let statusTimeout;
function showStatus(message) {
    statusSpan.textContent = message;
    statusSpan.classList.add('visible');
    
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
        statusSpan.classList.remove('visible');
    }, 2000);
}

// Clear note
function clearNote() {
    if (confirm('Are you sure you want to clear your note?')) {
        noteArea.value = '';
        localStorage.removeItem(STORAGE_KEY);
        showStatus('Cleared');
    }
}

// Event Listeners
noteArea.addEventListener('input', () => {
    saveNote();
});

clearBtn.addEventListener('click', clearNote);

// Initialize
loadNote();
