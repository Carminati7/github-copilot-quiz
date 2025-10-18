// Funzione per generare il quiz a partire dalle domande
export function generateQuiz(questions, form, resultsDiv, submitBtn, shouldRandomize = true) {
  // Svuota eventuale contenuto precedente
  form.innerHTML = "";
  resultsDiv.innerHTML = "";
  submitBtn.disabled = false;

  // Assicurati che stiamo lavorando con l'array di domande corretto
  const questionArray = Array.isArray(questions) ? questions : 
                       (questions.questions ? questions.questions : []);

  // Determina se siamo nella tab del quiz custom
  const isCustomQuiz = document.querySelector('#customQuiz').classList.contains('active');
  
  // Seleziona il numero di domande dal dropdown appropriato
  const select = document.getElementById(isCustomQuiz ? 'customQuestionCount' : 'predefinedQuestionCount');
  console.log(select.value);
  const numQuestions = select ? parseInt(select.value) : 20;

  let selectedQuestions;
  if (shouldRandomize) {
    // Applica il filtro e randomizza
    const filteredQuestions = filterQuestions(questionArray);
    selectedQuestions = filteredQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, numQuestions);
  } else {
    // Usa le domande nell'ordine fornito
    selectedQuestions = questionArray;
  }

  selectedQuestions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");

    // Determina se la domanda ha risposte multiple
    const isMultipleAnswer = Array.isArray(q.rispostaCorretta);
    const numCorrectAnswers = isMultipleAnswer ? q.rispostaCorretta.length : 1;

    qDiv.innerHTML = `
      <p><strong>${index + 1}. ${q.domanda}</strong></p>
      ${isMultipleAnswer ? `<p class="multiple-answer-notice">Seleziona ${numCorrectAnswers} risposte corrette</p>` : ''}
      ${q.codeBlock ? `<div class="code-block"><pre>${q.codeBlock}</pre></div>` : ''}
      <div class="options">
        ${Object.entries(q.risposte)
          .map(
            ([key, val]) =>
              `<label><input type="${isMultipleAnswer ? 'checkbox' : 'radio'}" name="q${index}" value="${key}"> ${key}) ${val}</label>`
          )
          .join("")}
      </div>
    `;
    form.appendChild(qDiv);
  });

  submitBtn.onclick = () => {
    let score = 0;

    // Controlla ogni domanda
    selectedQuestions.forEach((question, index) => {
      const isMultipleAnswer = Array.isArray(question.rispostaCorretta);
      const inputs = document.querySelectorAll(`input[name=q${index}]`);
      const selectedAnswers = Array.from(inputs)
        .filter(input => input.checked)
        .map(input => input.value);

      let isCorrect = false;
      if (isMultipleAnswer) {
        // Per risposte multiple, controlla che siano state selezionate tutte e sole le risposte corrette
        isCorrect = selectedAnswers.length === question.rispostaCorretta.length &&
                   selectedAnswers.every(answer => question.rispostaCorretta.includes(answer));
      } else {
        // Per risposta singola, controlla che sia stata selezionata la risposta corretta
        isCorrect = selectedAnswers.length === 1 && selectedAnswers[0] === question.rispostaCorretta;
      }

      if (isCorrect) {
        selectedAnswers.forEach(answer => {
          const input = document.querySelector(`input[name=q${index}][value="${answer}"]`);
          if (input) input.parentElement.classList.add("correct");
        });
        score++;
      } else {
        // Marca le risposte selezionate come incorrette
        selectedAnswers.forEach(answer => {
          const input = document.querySelector(`input[name=q${index}][value="${answer}"]`);
          if (input) input.parentElement.classList.add("incorrect");
        });

        // Evidenzia le risposte corrette
        const correctAnswers = Array.isArray(question.rispostaCorretta) ? 
                             question.rispostaCorretta : 
                             [question.rispostaCorretta];
        correctAnswers.forEach(answer => {
          const input = document.querySelector(`input[name=q${index}][value="${answer}"]`);
          if (input) input.parentElement.classList.add("correct");
        });
      }

      // Disabilita tutte le opzioni per questa domanda
      inputs.forEach(el => el.disabled = true);
    });

    resultsDiv.innerHTML = `<h2>Hai totalizzato ${score} su ${selectedQuestions.length} punti.</h2>`;
    submitBtn.disabled = true;
  };

  // Ritorna le domande selezionate per permettere la condivisione
  if (!shouldRandomize) {
    // Se non è randomizzato, ritorna l'array originale
    return questionArray;
  }
  return selectedQuestions;
}

//Filtra le domande in base all'origine selezionata
export function filterQuestions(questions) {
  const originSelect = document.getElementById("originSelect");
  const val = originSelect.value;
  if (val === "all") return questions;
  if (val === "no-copilot-gpt") return questions.filter(q => q.origin !== "copilot" && q.origin !== "GPT");
  return questions;
}