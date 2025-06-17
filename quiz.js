const form = document.getElementById("quizForm");
const resultsDiv = document.getElementById("results");
const submitBtn = document.getElementById("submitBtn");

// Funzione per generare il quiz a partire dalle domande
function generateQuiz(questions) {
  // Svuota eventuale contenuto precedente
  form.innerHTML = "";
  resultsDiv.innerHTML = "";
  submitBtn.disabled = false;

  // Applica il filtro
  const filteredQuestions = filterQuestions(questions);
  // Estrai 20 domande casuali
  const selectedQuestions = filteredQuestions
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

// Crea la select per filtrare le domande per origin
const filterDiv = document.createElement("div");
filterDiv.style.margin = "16px 0";
const filterLabel = document.createElement("label");
filterLabel.textContent = "Includi domande con origin: ";
filterLabel.setAttribute("for", "originSelect");
const originSelect = document.createElement("select");
originSelect.id = "originSelect";
originSelect.innerHTML = `
  <option value="all">Tutte</option>
  <option value="no-copilot-gpt">Escludi copilot & GPT</option>
`;
filterDiv.appendChild(filterLabel);
filterDiv.appendChild(originSelect);
form.parentElement.insertBefore(filterDiv, form);

function filterQuestions(questions) {
  const val = originSelect.value;
  if (val === "all") return questions;
  if (val === "no-copilot-gpt") return questions.filter(q => q.origin !== "copilot" && q.origin !== "GPT");
  return questions;
}

// Carica il file JSON e genera il quiz
fetch("quizzes-query.json")
  .then((response) => {
    if (!response.ok) throw new Error("Errore nel caricamento del file JSON");
    return response.json();
  })
  .then((data) => {
    window.quizData = data; // Salva i dati globalmente per rigenerare il quiz
    generateQuiz(data);
  })
  .catch((error) => {
    resultsDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  });

// Bottone per rigenerare il quiz senza refresh
const regenBtn = document.createElement("button");
regenBtn.id = "regenBtn";
regenBtn.textContent = "Rigenera Quiz";
regenBtn.type = "button";
regenBtn.style.margin = "16px 0";
regenBtn.onclick = () => {
  if (window.quizData) generateQuiz(window.quizData);
};
form.parentElement.insertBefore(regenBtn, form);

originSelect.onchange = () => {
  if (window.quizData) generateQuiz(window.quizData);
};
