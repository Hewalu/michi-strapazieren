
document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    resetContent();

    buttonListeners();



    function buttonListeners() {
        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        const button3 = document.getElementById('button3');

        button1.addEventListener('click', button1Click);
        button2.addEventListener('click', button2Click);
        button3.addEventListener('click', button3Click);
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

    function setMorseContent() {
        content.innerHTML = `
        <h1>Morsen</h1>
        <input type="text" id="morseInput" placeholder="Text eingeben">
        <button id="morseButton">Morse</button>
        <button id="resetButton">Zurück</button>
    `;
        resetButtonListener();
    }

    function setAbfuckContent() {
        content.innerHTML = `
        <h1>Michi wird abgefuckt</h1>
        <button id="resetButton">abrechen</button>
    `;
        resetButtonListener();
    }

    function setBeleuchtungContent() {
        content.innerHTML = `
        <h1>Michi wird dauerhaft beleuchtet.</h1>
        <button id="resetButton">Abrechen</button>
    `;
        resetButtonListener();
    }

    function resetContent() {
        content.innerHTML = `
        <h1 class="headline">Angriff auf Michi ausführen</h1>
        <p>Wie willst du angreifen:</p>
        <button id="button1">An Michi morsen</button>
        <button id="button2">Michi abfucken</button>
        <button id="button3">Michi dauerhaft beleuchten</button>
    `;
        buttonListeners();
    }

    function lampeAn() {
        console.log('Lampe an');
        // fetch('https://theramatch.de/gpio?state=HIGH', { mode: 'no-cors' })
        //     .then(response => {
        //         console.log('Lampe an');
        //     })
        //     .catch(error => {
        //         console.error('Fehler:', error);
        //     });
    }

    function lampeAus() {
        console.log('Lampe aus');
        // fetch('https://theramatch.de/gpio?state=LOW', { mode: 'no-cors' })
        //     .then(response => {
        //         console.log('Lampe aus');
        //     })
        //     .catch(error => {
        //         console.error('Fehler:', error);
        //     });
    }

});