import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const outputText = document.getElementById('outputText');
const speakButton = document.getElementById('speakButton');
const lastTranslationElement = document.getElementById('lastTranslation');

let translationTimeout;

async function translateText() {
    const text = inputText.value;
    const target = targetLanguage.value;

    if (text.trim() === '') {
        outputText.value = '';
        return;
    }

    try {
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: target
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        outputText.value = data.translatedText;

        // Store the last translation in the backend
        await backend.setLastTranslation(data.translatedText);
    } catch (error) {
        console.error('Translation error:', error);
        outputText.value = 'Error: Could not translate text.';
    }
}

function debounceTranslation() {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(translateText, 300);
}

function speakTranslation() {
    const text = outputText.value;
    if (text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage.value;
    speechSynthesis.speak(utterance);
}

async function getLastTranslation() {
    try {
        const lastTranslation = await backend.getLastTranslation();
        lastTranslationElement.textContent = lastTranslation || 'No previous translation';
    } catch (error) {
        console.error('Error fetching last translation:', error);
        lastTranslationElement.textContent = 'Error fetching last translation';
    }
}

inputText.addEventListener('input', debounceTranslation);
targetLanguage.addEventListener('change', translateText);
speakButton.addEventListener('click', speakTranslation);

// Fetch the last translation when the page loads
window.addEventListener('load', getLastTranslation);
