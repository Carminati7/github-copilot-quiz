import { getQuizFromUrl, showQuizLink } from './quiz-sharing.js';
import { filterQuestions } from './quiz-generator.js';

// Gestione del caricamento dei quiz
export async function loadQuizData(type, form, resultsDiv, submitBtn, { generateQuiz }) {
  // Reset previous results
  resultsDiv.innerHTML = "";
  form.innerHTML = "";

  // Controlla se c'è un quiz nell'URL
  const urlQuiz = getQuizFromUrl();
  if (urlQuiz) {
    document.getElementById('quizContainer').style.display = 'block';
    // Passa le domande direttamente e imposta shouldRandomize a false
    return generateQuiz(urlQuiz.questions || urlQuiz, form, resultsDiv, submitBtn, false);
  }
  
  if (type === 'custom') {
    return handleCustomQuiz(form, resultsDiv, submitBtn, generateQuiz);
  }

  const topicSelect = document.getElementById("topicSelect");
  const topicResource = topicSelect.value;
  
  try {
    const response = await fetch(topicResource);
    if (!response.ok) throw new Error("Errore nel caricamento del file delle domande JSON");
    
    const data = await parseResponse(response, topicResource);
    window.quizData = data; // Salva i dati globalmente per rigenerare il quiz
    document.getElementById('quizContainer').style.display = 'block';
    generateQuiz(data, form, resultsDiv, submitBtn);
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

async function parseResponse(response, topicResource) {
  const ext = topicResource.split('.').pop().toLowerCase();
  if(ext === 'json'){
    return response.json();
  } else if (ext === 'yaml' || ext === 'yml') {
    const text = await response.text();
    return YAML.parse(text);
  } else {
    throw new Error('Tipo di file non supportato:' + ext);
  }
}

// Funzione per selezionare N domande random da un set
function selectRandomQuestions(questions, count = 20) {
  const filteredQuestions = filterQuestions(questions);
  return filteredQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map((q, index) => ({
      ...q,
      originalIndex: index  // Manteniamo l'ordine generato
    }))
    .sort((a, b) => a.originalIndex - b.originalIndex);
}

function handleCustomQuiz(form, resultsDiv, submitBtn, generateQuiz) {
  const customQuizText = document.getElementById('customQuizText').value.trim();
  if (!customQuizText) {
    resultsDiv.innerHTML = `<p style="color:red;">Inserisci il contenuto del quiz nel campo di testo</p>`;
    return;
  }

  try {
    let data;
    // Prova a fare il parse come JSON, se fallisce prova come YAML
    try {
      data = JSON.parse(customQuizText);
    } catch {
      data = YAML.parse(customQuizText);
    }

    // Genera il quiz e ottieni le domande selezionate
    window.quizData = data;
    document.getElementById('quizContainer').style.display = 'block';
    const selectedQuestions = generateQuiz(data, form, resultsDiv, submitBtn, true); // true = permetti la randomizzazione

    // Crea l'oggetto quiz con metadata e solo le domande selezionate
    const quizToShare = {
      questions: selectedQuestions,
      metadata: {
        createdAt: new Date().toISOString(),
        type: 'custom'
      }
    };
    
    // Genera e mostra il link del quiz
    showQuizLink(quizToShare);
    
    // Controlla se deve svuotare il campo
    const clearAfterGenerate = document.getElementById('clearAfterGenerate').checked;
    if (clearAfterGenerate) {
      document.getElementById('customQuizText').value = '';
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">Errore nel parsing del file: ${error.message}</p>`;
  }
}