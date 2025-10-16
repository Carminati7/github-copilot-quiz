import { initializeTabs, initializeTopics } from './ui-manager.js';
import { loadQuizData } from './quiz-loader.js';
import { generateQuiz } from './quiz-generator.js';

// Elementi DOM principali
const form = document.getElementById("quizForm");
const resultsDiv = document.getElementById("results");
const submitBtn = document.getElementById("submitBtn");

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  initializeTopics();
  
  // Aggiungi event listener ai pulsanti di generazione quiz
  document.querySelectorAll('.genBtn').forEach(btn => {
    btn.onclick = () => {
      const tabId = btn.closest('.tab-content').id.replace('Quiz', '');
      loadQuizData(tabId, form, resultsDiv, submitBtn, { generateQuiz });
    };
  });
});