const MORSE_CODE_DICT = {
    'A': '•−', 'B': '−•••', 'C': '−•−•', 'D': '−••', 'E': '•',
    'F': '••−•', 'G': '−−•', 'H': '••••', 'I': '••', 'J': '•−−−',
    'K': '−•−', 'L': '•−••', 'M': '−−', 'N': '−•', 'O': '−−−',
    'P': '•−−•', 'Q': '−−•−', 'R': '•−•', 'S': '•••', 'T': '−',
    'U': '••−', 'V': '•••−', 'W': '•−−', 'X': '−••−', 'Y': '−•−−',
    'Z': '−−••', '1': '•−−−−', '2': '••−−−', '3': '•••−−', '4': '••••−',
    '5': '•••••', '6': '−••••', '7': '−−•••', '8': '−−−••', '9': '−−−−•',
    '0': '−−−−−', ' ': ' '
};

const SHORT_SIGNAL = 600;
const LONG_SIGNAL = 1200;

const PAUSE_BETWEEN_SIGNALS = 600;
const PAUSE_BETWEEN_LETTERS = 1200;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    let morse_state = 'ready';
    // resetContent();
    setMorseContent();

    buttonListeners();

    function buttonListeners() {
        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        const button3 = document.getElementById('button3');

        if (button1) {
            button1.addEventListener('click', button1Click);
        }
        if (button2) {
            button2.addEventListener('click', button2Click);
        }
        if (button3) {
            button3.addEventListener('click', button3Click);
        }
    }


    function button1Click() {
        setContent('morsen');
    }

    function button2Click() {
        setContent('abfucken');
    }

    function button3Click() {
        setContent('beleuchten');
    }

    function setContent(state) {
        if (state === 'morsen') {
            setMorseContent();
        } else if (state === 'abfucken') {
            setAbfuckContent();
        } else if (state === 'beleuchten') {
            setBeleuchtungContent();
        } else if (state === 'reset') {
            resetContent();
        }
    }

    function resetButtonListener() {
        const resetButton = document.getElementById('resetButton');
        resetButton.addEventListener('click', resetContent);
    }

    function morseListener() {
        const sendButton = document.getElementById('send-button');
        const input = document.getElementById('morseInput');
        sendButton.addEventListener('click', toggleMorseState);
        input.addEventListener('keyup', function (event) {
            if (event.key === 'Enter' && morse_state === 'ready') {
                toggleMorseState();
            }
        });
    }

    function toggleMorseState() {
        if (morse_state === 'ready') {
            const input = document.getElementById('morseInput');
            const message = (input.value).trim();
            if (message !== '') {
                morse_state = 'sending';
                setSendButtonContent(true);
                sendMorseMessage(message);
                input.value = '';
            }
        } else if (morse_state === 'sending') {
            morse_state = 'ready';
            setSendButtonContent(false);
        }
    }

    async function sendMorseMessage(message) {
        const messagePreview = document.getElementById('message-preview');
        const messagePreviewCode = messagePreview.querySelector('.message-preview-code');
        const messagePreviewMessage = messagePreview.querySelector('.message-preview-message');

        let char_index = 0;
        for (const char of message) {
            messagePreviewMessage.innerHTML += `<span id="char-${char_index}" data-active="${char_index === 0}">${char}</span>`;
            char_index++;
        }

        let activeChar = messagePreviewMessage.querySelector('#char-0');

        let char_async_index = 0;
        for (const char of message.toUpperCase()) {
            if (morse_state !== 'sending') {
                break;
            }
            if (char_async_index !== 0) {
                activeChar.setAttribute('data-active', 'false');
                activeChar = messagePreviewMessage.querySelector(`#char-${char_async_index}`);
                activeChar.setAttribute('data-active', 'true');
            }
            if (MORSE_CODE_DICT[char]) {
                const code = MORSE_CODE_DICT[char];

                messagePreviewCode.innerHTML = '';

                let symbol_index = 0;
                for (const symbol of code) {
                    messagePreviewCode.innerHTML += `<span id="symbol-${symbol_index}" data-active="${symbol_index === 0}">${symbol}</span>`;
                    symbol_index++;
                }

                let activeSymbol = messagePreviewCode.querySelector('#symbol-0');

                let symbol_async_index = 0;
                for (const symbol of code) {
                    if (morse_state !== 'sending') {
                        break;
                    }
                    if (symbol_async_index !== 0) {
                        activeSymbol.setAttribute('data-active', 'false');
                        activeSymbol = messagePreviewCode.querySelector(`#symbol-${symbol_async_index}`);
                        activeSymbol.setAttribute('data-active', 'true');
                    }
                    if (symbol === '•') {
                        await sendMorseSignal(SHORT_SIGNAL);
                    } else if (symbol === '−') {
                        await sendMorseSignal(LONG_SIGNAL);
                    } else if (symbol === ' ') {
                        await sleep(PAUSE_BETWEEN_LETTERS - PAUSE_BETWEEN_SIGNALS);
                    }
                    symbol_async_index++;
                }
            }
            else {
                console.warn('Unbekanntes Symbol: ', char);
            }
            char_async_index++;
        }
        messagePreviewMessage.innerHTML = '';
        messagePreviewCode.innerHTML = '';
        morse_state = 'ready';
        setSendButtonContent(false);
    }

    async function sendMorseSignal(duration) {
        await lampeAn();
        await sleep(duration);
        await lampeAus();
        await sleep(PAUSE_BETWEEN_SIGNALS);
    }

    function setSendButtonContent(isSending) {
        const sendButton = document.getElementById('send-button');
        if (sendButton) {
            if (isSending) {
                sendButton.innerHTML = `<div class="cancel-button"></div>`;
            } else {
                sendButton.innerHTML = `<img src="assets/send_icon.svg" alt="Send Button"/>`;
            }
        }
    }

    function setMorseContent() {
        content.setAttribute('data-type', 'morse');
        content.innerHTML = `
        <div class="head-bar">
        <div id="resetButton"><img src="assets/arrow_left_icon.svg" alt="Back Button"/></div>
        <h1>Morsen</h1>
        </div>
        <div id="message-preview">
        <div class="message-preview-code"></div>
        <div class="message-preview-message"></div>
        </div>
        <div class="input-wrapper">
        <input type="text" id="morseInput" placeholder="Nachricht an Michi...">
        <div id="send-button">
        <img src="assets/send_icon.svg" alt="Send Button"/>
        </div>
        </div>
    `;
        morseListener();
        resetButtonListener();
    }

    function setAbfuckContent() {
        content.setAttribute('data-type', 'abfuck');
        content.innerHTML = `
        <h1>Michi wird abgefuckt</h1>
        <button id="resetButton">abrechen</button>
    `;
        resetButtonListener();
    }

    function setBeleuchtungContent() {
        content.setAttribute('data-type', 'beleuchtung');
        content.innerHTML = `
        <h1>Michi wird dauerhaft beleuchtet.</h1>
        <button id="resetButton">Abrechen</button>
    `;
        resetButtonListener();
    }

    function resetContent() {
        if (morse_state === 'sending') {
            morse_state = 'ready';
        }
        content.setAttribute('data-type', 'default');
        content.innerHTML = `
        <h1 class="headline">Angriff auf Michi ausführen</h1>
        <p>Wie willst du angreifen:</p>
        <button id="button1">An Michi morsen</button>
        <button id="button2">Michi abfucken</button>
        <button id="button3">Michi dauerhaft beleuchten</button>
    `;
        buttonListeners();
    }

    async function lampeAn() {
        // console.log('Lampe an');
        // fetch('https://theramatch.de/gpio?state=HIGH', { mode: 'no-cors' })
        //     .then(response => {
        //         console.log('Lampe an');
        //     })
        //     .catch(error => {
        //         console.error('Fehler:', error);
        //     });
    }

    async function lampeAus() {
        // console.log('Lampe aus');
        // fetch('https://theramatch.de/gpio?state=LOW', { mode: 'no-cors' })
        //     .then(response => {
        //         console.log('Lampe aus');
        //     })
        //     .catch(error => {
        //         console.error('Fehler:', error);
        //     });
    }

});