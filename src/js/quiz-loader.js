// Gestione del caricamento dei quiz
export async function loadQuizData(type, form, resultsDiv, submitBtn, { generateQuiz }) {
  // Reset previous results
  resultsDiv.innerHTML = "";
  form.innerHTML = "";
  
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
    window.quizData = data;
    document.getElementById('quizContainer').style.display = 'block';
    generateQuiz(data, form, resultsDiv, submitBtn);
    
    // Controlla se deve svuotare il campo
    const clearAfterGenerate = document.getElementById('clearAfterGenerate').checked;
    if (clearAfterGenerate) {
      document.getElementById('customQuizText').value = '';
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">Errore nel parsing del file: ${error.message}</p>`;
  }
}