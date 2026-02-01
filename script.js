/* MIT PHYSICS ACADEMIC PORTAL
   Engine: Native Browser Features Only (No External Libs)
*/

// --- 1. NOTES LIBRARY NAVIGATION ---

function switchNote(noteId) {
    // UI Update: Sidebar Buttons
    const buttons = document.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // UI Update: Content Area
    const notes = document.querySelectorAll('.note-entry');
    notes.forEach(note => {
        note.classList.remove('active');
        note.style.display = 'none'; // Hard reset for display
    });

    // Fade In Target
    const target = document.getElementById(noteId);
    if (target) {
        target.style.display = 'block';
        // Small delay to allow CSS transition to catch the display change
        requestAnimationFrame(() => target.classList.add('active'));
    }
}

// --- 2. NATIVE PDF PRINT ENGINE ---

/**
 * Prepares the DOM for a clean academic print, waits for MathJax,
 * and triggers the browser's native print dialog.
 * * @param {string} articleId - The ID of the article to print
 */
async function printArticle(articleId) {
    const target = document.getElementById(articleId);
    if (!target) return;

    // A. Set State Classes
    // These classes trigger the @media print CSS to hide everything else
    document.body.classList.add('is-printing');
    target.classList.add('print-target');

    // B. Ensure Math is Ready
    // We wait for MathJax to finish any pending rendering to ensure
    // vectors are fully drawn before the print dialog opens.
    if (window.MathJax) {
        try {
            await window.MathJax.typesetPromise();
        } catch (e) {
            console.warn("MathJax typeset warning:", e);
        }
    }

    // C. Trigger Native Print
    // This opens the system dialog. The script pauses here in most browsers.
    window.print();

    // D. Cleanup State
    // Runs immediately after the user cancels or finishes printing
    // Use a small timeout to ensure dialog is fully closed visually
    setTimeout(() => {
        document.body.classList.remove('is-printing');
        target.classList.remove('print-target');
    }, 500);
}

// --- 3. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Ensure MathJax renders on initial load
    if (window.MathJax) {
        window.MathJax.typeset();
    }
});