const form = document.getElementById("quizForm");
const resultsDiv = document.getElementById("results");
const submitBtn = document.getElementById("submitBtn");

// Funzione per generare il quiz a partire dalle domande
function generateQuiz(questions) {
  // Svuota eventuale contenuto precedente
  form.innerHTML = "";
  resultsDiv.innerHTML = "";
  submitBtn.disabled = false;

  // Estrai 20 domande casuali
  const selectedQuestions = questions
    .sort(() => 0.5 - Math.random())
    .slice(0, 20);

  selectedQuestions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");

    qDiv.innerHTML = `
      <p><strong>${index + 1}. ${q.domanda}</strong></p>
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
}

// Carica il file JSON e genera il quiz
fetch("quizzes-query.json")
  .then((response) => {
    if (!response.ok) throw new Error("Errore nel caricamento del file JSON");
    return response.json();
  })
  .then((data) => {
    generateQuiz(data);
  })
  .catch((error) => {
    resultsDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  });
