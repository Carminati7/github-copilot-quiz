// Gestione delle tabs
export function initializeTabs() {
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
}

// Funzione per cambiare tab
export function switchTab(tabId) {
  // Rimuovi la classe active da tutti i pulsanti e contenuti
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Aggiungi la classe active al pulsante e al contenuto corrispondente
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId + 'Quiz').classList.add('active');

  // Nascondi il container del quiz quando si cambia tab
  if (!tabId.startsWith('shared')) {
    document.getElementById('quizContainer').style.display = 'none';
  }
}

// Nasconde tutte le tab e mostra solo il quiz
export function hideTabsAndShowQuiz() {
  // Nascondi tutte le tab e i loro contenuti
  document.querySelector('.tabs').style.display = 'none';
  document.querySelectorAll('.tab-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // Mostra il container del quiz
  document.getElementById('quizContainer').style.display = 'block';
}

// Inizializzazione dei topic
export function initializeTopics() {
  fetch('data/quizzes-topics.json')
    .then((response) => {
      if (!response.ok) throw new Error("Errore nel caricamento del file dei topic JSON");
      return response.json();
    })
    .then((data) => {
      const topicSelect = document.getElementById("topicSelect");
      let topicInnerHtml = '';
      data.forEach(topic => {
        if (topic.resource !== 'custom') {  // Escludiamo l'opzione custom
          topicInnerHtml += `  <option value="${topic.resource}">${topic.title}</option>`;
        }
      });
      topicSelect.innerHTML = topicInnerHtml;
    });
}