const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const translateUrl = "https://api.mymemory.translated.net/get?q="; // Translation API URL

const result = document.getElementById("result");
const btn = document.getElementById("search-button"); // Corrected the id to match the HTML

btn.addEventListener("click", () => {
    let word = document.getElementById("word-input").value;

    if (!word) {
        result.innerHTML = `<p class="error">Please enter a word to search.</p>`;
        return;
    }

    fetch(url + word)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // Search for the first available audio file in all phonetics entries
            const audioSrc = data[0].phonetics.find(phonetic => phonetic.audio)?.audio || "";

            result.innerHTML = `
                <div class="word">
                    <h3>${data[0].word}</h3>
                    <button id="play-audio">🔊</button>
                </div>
                <div class="details">
                    <p><strong>Part of Speech:</strong> ${data[0].meanings[0].partOfSpeech}</p>
                    <p><strong>Definition:</strong> ${data[0].meanings[0].definitions[0].definition}</p>
                    <p><strong>Example:</strong> "${data[0].meanings[0].definitions[0].example || 'N/A'}"</p>
                </div>
            `;

            const playAudioBtn = document.getElementById("play-audio");
            if (audioSrc) {
                playAudioBtn.addEventListener("click", () => {
                    const audio = new Audio(audioSrc);
                    audio.play();
                });
            } else {
                playAudioBtn.disabled = true;
                playAudioBtn.title = "Audio not available";
            }
        })
        .catch((error) => {
            console.error(error);
            result.innerHTML = `<p class="error">${error.message}</p>`;
        });
});

const wordInput = document.getElementById("word-input");
const translationResult = document.createElement("p");
translationResult.id = "translation-result";
result.parentNode.insertBefore(translationResult, result);

wordInput.addEventListener("input", () => {
    const word = wordInput.value.trim();

    if (!word) {
        translationResult.textContent = ""; // Clear translation if input is empty
        return;
    }

    fetch(`${translateUrl}${word}&langpair=en|bn`)
        .then((response) => response.json())
        .then((data) => {
            const translation = data.responseData.translatedText;
            translationResult.textContent = `Bangla Translation: ${translation}`;
        })
        .catch((error) => {
            console.error("Translation error:", error);
            translationResult.textContent = "Error fetching translation.";
        });
});
