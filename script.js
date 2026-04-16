document.addEventListener('DOMContentLoaded', () => {

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const result = document.getElementById('result');
  const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "Light Mode";
} else {
  themeToggle.textContent = "Dark Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
});

  searchBtn.addEventListener('click', () => {

    const word = searchInput.value.trim();

    if (word === "") {
      result.innerHTML = "Please enter a word!";
      return;
    }

    fetchWord(word);
  });


  function fetchWord(word) {

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

      .then(response => {

        if (!response.ok) {
          throw new Error("Word not found, try another one!");
        }

        return response.json();
      })

      .then(data => {
        displayWord(data);
      })

      .catch(error => {
        result.innerHTML = error.message;
      });
  }

  function displayWord(data) {
  const entry = data[0];

  const word = entry.word;
  const phonetic = entry.phonetic || "No phonetic available";
  const audio = entry.phonetics.find(p => p.audio)?.audio;

  const meaningsHTML = entry.meanings.map((meaning) => {

  const definitions = meaning.definitions
    .map(def => {
      return `
        <li>
          ${def.definition}
          ${def.example ? `<br><em style="color:#6b7280;">Example: ${def.example}</em>` : ""}
        </li>
      `;
    })
    .join("");

  const synonyms = [
    ...new Set([
      ...(meaning.synonyms || []),
      ...meaning.definitions.flatMap(d => d.synonyms || [])
    ])
  ];

  const antonyms = [
    ...new Set([
      ...(meaning.antonyms || []),
      ...meaning.definitions.flatMap(d => d.antonyms || [])
    ])
  ];

  return `
    <div class="meaning-block">
      <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>

      <p><strong>Definitions:</strong></p>
      <ul>${definitions}</ul>

      <p><strong>Synonyms:</strong> ${
        synonyms.length ? synonyms.join(", ") : "None"
      }</p>

      <p><strong>Antonyms:</strong> ${
        antonyms.length ? antonyms.join(", ") : "None"
      }</p>
    </div>
  `;
}).join("");

 
  result.innerHTML = `
    <h2>${word}</h2>
    <p>${phonetic}</p>

    ${
      audio
        ? `<audio controls src="${audio}"></audio>`
        : "<p>No audio available</p>"
    }

    <hr />

    ${meaningsHTML}
  `;
}

  searchInput.addEventListener('keypress', (e) => {

    if (e.key === "Enter") {

      searchBtn.click();
    }
  });

});