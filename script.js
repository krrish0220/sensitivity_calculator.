document.addEventListener('DOMContentLoaded', function() {
    let gamesData = [];

    // Function to fetch CSV file
    function fetchCSVFile(url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(callback)
            .catch(error => console.error('Error fetching CSV file:', error));
    }

    // Populate game options from CSV data
    function populateGameOptions(csvData) {
        const rows = csvData.split('\n');
        for (let i = 1; i < rows.length; i++) {
            const [title, sensitivityFactor] = rows[i].split(',');
            if (title && sensitivityFactor) {
                gamesData.push({ title, sensitivityFactor: parseFloat(sensitivityFactor) });
            }
        }

        const fromGameSelect = document.getElementById('fromGame');
        const toGameSelect = document.getElementById('toGame');

        gamesData.forEach(game => {
            const option = document.createElement('option');
            option.value = game.title;
            option.textContent = game.title;
            fromGameSelect.add(option.cloneNode(true));
            toGameSelect.add(option.cloneNode(true));
        });
    }

    // Fetch CSV file and populate game options
    fetchCSVFile('games.csv', populateGameOptions);

    // Event listener for form submission
    document.getElementById('conversionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fromGame = document.getElementById('fromGame').value;
        const toGame = document.getElementById('toGame').value;
        const fromSensitivity = parseFloat(document.getElementById('fromSensitivity').value);
        const fromDPI = parseInt(document.getElementById('fromDPI').value);
        const toDPI = parseInt(document.getElementById('toDPI').value);

        if (isNaN(fromSensitivity) || isNaN(fromDPI) || isNaN(toDPI)) {
            console.error('Invalid input values.');
            return;
        }

        const fromGameData = gamesData.find(game => game.title === fromGame);
        const toGameData = gamesData.find(game => game.title === toGame);

        if (!fromGameData || !toGameData) {
            console.error('Game data not found for selected games.');
            return;
        }

        const fromSensitivityFactor = fromGameData.sensitivityFactor;
        const toSensitivityFactor = toGameData.sensitivityFactor;

        const baseSensitivity = fromSensitivity / fromSensitivityFactor;
        const convertedSensitivity = baseSensitivity * toSensitivityFactor * (fromDPI / toDPI);

        // Display result
        document.getElementById('convertedSens').textContent = convertedSensitivity.toFixed(2);
    });
});
