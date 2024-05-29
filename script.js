document.addEventListener('DOMContentLoaded', function() {
      });
      
    let gamesData = [];

    // Function to fetch CSV file
    function fetchCSVFile(url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(callback)
            .catch(error => console.error('Error fetching CSV file:', error));
    }

    // Populate game options from CSV datas
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
            option.text = game.title;
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
        // const cmPer360 = (2.54 * 360) / (convertedSensitivity * toDPI);
        // const inchPer360 = cmPer360 / 2.54;
        // const inchper360 = (toDPI *  convertedSensitivity) / 360 )

 
        // Display result
        document.getElementById('convertedSens').textContent = convertedSensitivity.toFixed(2);
        // document.getElementById('cmPer360').textContent = cmPer360.toFixed(2);
        // document.getElementById('inchPer360').textContent = inchPer360.toFixed(2);
    });

    // Inside the populateGameOptions function after populating game options
    const sensitivitySelect = document.getElementById('fromSensitivity');
    // Clear any existing options
    sensitivitySelect.innerHTML = '';
    // Define sensitivity values
    const sensitivityValues = [138544, 6648, 41561.8, 138544, 159592, 41560, 13062.4]; // Add or adjust sensitivity values as needed
    // Populate sensitivity options
    sensitivityValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        sensitivitySelect.appendChild(option);
    });
