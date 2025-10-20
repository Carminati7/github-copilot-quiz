import { initializeTabs, initializeTopics, hideTabsAndShowQuiz } from './ui-manager.js';
import { loadQuizData } from './quiz-loader.js';
import { generateQuiz } from './quiz-generator.js';
import { getQuizFromUrl } from './quiz-sharing.js';

// Elementi DOM principali
const form = document.getElementById("quizForm");
const resultsDiv = document.getElementById("results");
const submitBtn = document.getElementById("submitBtn");

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', async () => {
  // Controlla se c'è un quiz nell'URL
  const urlQuiz = getQuizFromUrl();
  
  if (urlQuiz) {
    // Se c'è un quiz nell'URL, nascondi le tab e mostra direttamente il quiz
    hideTabsAndShowQuiz();
    await loadQuizData('shared', form, resultsDiv, submitBtn, { generateQuiz });
  } else {
    // Altrimenti, inizializza normalmente l'applicazione
    initializeTabs();
    initializeTopics();
  }
  
  // Aggiungi event listener ai pulsanti di generazione quiz
  document.querySelectorAll('.genBtn').forEach(btn => {
    btn.onclick = () => {
      const tabId = btn.closest('.tab-content').id.replace('Quiz', '');
      loadQuizData(tabId, form, resultsDiv, submitBtn, { generateQuiz });
    };
  });
});