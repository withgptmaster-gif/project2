const noteArea = document.getElementById('note-area');
const statusSpan = document.getElementById('status');
const newBtn = document.getElementById('new-btn');
const openBtn = document.getElementById('open-btn');
const saveBtn = document.getElementById('save-btn');
const saveAsBtn = document.getElementById('save-as-btn');
const closeFileBtn = document.getElementById('close-file-btn');
const clearBtn = document.getElementById('clear-btn'); // Keep footer clear for local quick clear

let fileHandle = null;

// Helper to update status
function showStatus(message, isError = false) {
    statusSpan.textContent = message;
    statusSpan.style.color = isError ? '#ff6b6b' : '#888';
    setTimeout(() => {
        statusSpan.textContent = fileHandle ? `Editing: ${fileHandle.name}` : 'Ready';
        statusSpan.style.color = '#888';
    }, 3000);
}

// 1. New File
async function newFile() {
    if (noteArea.value && !confirm('Discard current changes?')) return;
    noteArea.value = '';
    fileHandle = null;
    showStatus('New file created');
}

// 2. Open File
async function openFile() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'Text Files',
                accept: { 'text/plain': ['.txt', '.md', '.js', '.html', '.css'] }
            }],
        });
        const file = await fileHandle.getFile();
        const contents = await file.text();
        noteArea.value = contents;
        showStatus(`Opened: ${fileHandle.name}`);
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
            showStatus('Failed to open file', true);
        }
    }
}

// 3. Save File
async function saveFile() {
    try {
        if (!fileHandle) {
            return await saveFileAs();
        }
        const writable = await fileHandle.createWritable();
        await writable.write(noteArea.value);
        await writable.close();
        showStatus(`Saved: ${fileHandle.name}`);
    } catch (err) {
        console.error(err);
        showStatus('Failed to save', true);
    }
}

// 4. Save As
async function saveFileAs() {
    try {
        fileHandle = await window.showSaveFilePicker({
            types: [{
                description: 'Text Files',
                accept: { 'text/plain': ['.txt'] }
            }],
        });
        await saveFile();
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
            showStatus('Failed to save as', true);
        }
    }
}

// 5. Close File
async function closeFile() {
    if (noteArea.value && !confirm('Close file? Any unsaved changes will be lost.')) return;
    noteArea.value = '';
    fileHandle = null;
    showStatus('File closed');
}

// Event Listeners
newBtn.addEventListener('click', newFile);
openBtn.addEventListener('click', openFile);
saveBtn.addEventListener('click', saveFile);
saveAsBtn.addEventListener('click', saveFileAs);
closeFileBtn.addEventListener('click', closeFile);

// Quick local clear (footer button)
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('Clear current text?')) {
            noteArea.value = '';
        }
    });
}

// Keyboard shortcuts (Ctrl+S, Ctrl+O)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
            e.preventDefault();
            saveFile();
        }
        if (e.key === 'o') {
            e.preventDefault();
            openFile();
        }
    }
});
