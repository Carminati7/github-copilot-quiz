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

    qDiv.innerHTML = `
      <p><strong>${index + 1}. ${q.domanda}</strong></p>
      ${q.codeBlock ? `<div class="code-block"><pre>${q.codeBlock}</pre></div>` : ''}
      <div class="options">
        ${Object.entries(q.risposte)
          .map(
            ([key, val]) =>
              `<label><input type="radio" name="q${index}" value="${key}"> ${key}) ${val}</label>`
          )
          .join("")}
      </div>
    `;
    form.appendChild(qDiv);
  });

  // Ritorna le domande selezionate per permettere la condivisione
  if (!shouldRandomize) {
    // Se non è randomizzato, ritorna l'array originale
    return questionArray;
  }
  return selectedQuestions;

  submitBtn.onclick = () => {
    let score = 0;
    const answers = document.querySelectorAll("input[type=radio]:checked");

    answers.forEach((input) => {
      const index = parseInt(input.name.replace("q", ""));
      const correct = selectedQuestions[index].rispostaCorretta;
      const selected = input.value;

      if (selected === correct) {
        input.parentElement.classList.add("correct");
        score++;
      } else {
        input.parentElement.classList.add("incorrect");
        const correctInput = document.querySelector(
          `input[name=q${index}][value=${correct}]`
        );
        if (correctInput) correctInput.parentElement.classList.add("correct");
      }

      // Disabilita tutte le opzioni per questa domanda
      document
        .querySelectorAll(`input[name=q${index}]`)
        .forEach((el) => (el.disabled = true));
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