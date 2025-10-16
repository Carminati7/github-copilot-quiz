// Gestione delle tabs
export function initializeTabs() {
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Rimuovi la classe active da tutti i pulsanti e contenuti
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Aggiungi la classe active al pulsante cliccato e al contenuto corrispondente
      button.classList.add('active');
      const tabId = button.dataset.tab;
      document.getElementById(tabId + 'Quiz').classList.add('active');

      // Nascondi il container del quiz quando si cambia tab
      document.getElementById('quizContainer').style.display = 'none';
    });
  });
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