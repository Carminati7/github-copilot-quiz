// Funzione per convertire array di byte in stringa base64 URL-safe
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// Funzione per convertire stringa base64 URL-safe in array di byte
function base64ToArrayBuffer(base64) {
    const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

// Funzione per generare il link del quiz
export function generateQuizLink(quizData) {
    try {
        // Converti l'oggetto quiz in stringa JSON
        const quizString = JSON.stringify(quizData);
        // Comprimi la stringa
        const compressed = pako.deflate(quizString, { to: 'string' });
        // Converti in base64 URL-safe
        const encoded = arrayBufferToBase64(compressed);
        // Crea l'URL con il parametro quiz
        const url = new URL(window.location.href);
        url.searchParams.set('quiz', encoded);
        return url.toString();
    } catch (error) {
        console.error('Errore nella generazione del link:', error);
        throw new Error('Errore nella generazione del link: ' + error.message);
    }
}

// Funzione per estrarre il quiz dall'URL
export function getQuizFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('quiz');
    
    if (!encoded) {
        return null;
    }

    try {
        // Converti da base64 URL-safe
        const compressed = base64ToArrayBuffer(encoded);
        // Decomprimi
        const quizString = pako.inflate(compressed, { to: 'string' });
        // Converti in oggetto JSON
        return JSON.parse(quizString);
    } catch (error) {
        console.error('Errore nel parsing del quiz dall\'URL:', error);
        return null;
    }
}

// Funzione per mostrare il link generato
export function showQuizLink(quizData) {
    const linkContainer = document.getElementById('quizLinkContainer');
    const linkInput = document.getElementById('quizLink');
    
    const link = generateQuizLink(quizData);
    linkInput.value = link;
    linkContainer.style.display = 'block';
}