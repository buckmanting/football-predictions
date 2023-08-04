const predictions = require('./predictions.json').predictions;
const gameweeks = require('./gameweeks.json').gameweeks;

console.log('starting to process');

const pointValues = {
    champion: 3,
    clPlace: 2,
    elPlace: 2,
    correctPlace: 1,
    closePlace: 0.5,
    relegationPlace: 2,
    relegationCorrectPlaceBonus: 1
}
const predictionTables = {};

// loop over each prediction
for (let j = 0; j < gameweeks.length; j++) {
    let gameweekScores = {};
    const gameweek = gameweeks[j];

    for (let i = 0; i < predictions.length; i++) {
        const prediction = predictions[i];

        gameweekScores[prediction.name] = {
            score: 0
        };

        // do they have the top team correct
        if (gameweek.champion.toLowerCase() === prediction.champion.toLowerCase()) {
            gameweekScores[prediction.name].score += pointValues.champion;
        }

        // do they have second through fourth correct
        prediction.clPlaces.forEach(team => {
            if (gameweek.clPlaces.includes(team)) {
                gameweekScores[prediction.name].score += pointValues.clPlace;
            }
        });

        // do they have fifth correct
        if (gameweek.elPlace.toLowerCase() === prediction.elPlace.toLowerCase()) {
            gameweekScores[prediction.name].score += pointValues.elPlace;
        }

        // loop over 6th-17th
        for (let k = 0; k < gameweek.places.length; k++) {
            // do they have correct place, or
            // do they have the correct team one spot off
            if (prediction.places[k] === gameweek.places[k]) {
                gameweekScores[prediction.name].score += pointValues.correctPlace;
            } else if (k > 0 && prediction.places[k - 1] === gameweek.places[k]) {
                gameweekScores[prediction.name].score += pointValues.closePlace;
            } else if (k < gameweek.places.length - 1 && prediction.places[k + 1] === gameweek.places[k]) {
                gameweekScores[prediction.name].score += pointValues.closePlace;
            }
        }

        // do they have relegation spots correct
        for (let k = 0; k < gameweek.relegation.length; k++) {
            // do they have correct place
            if (prediction.relegation[k] === gameweek.relegation[k]) {
                gameweekScores[prediction.name].score += pointValues.relegationCorrectPlaceBonus;
            }
            if (prediction.relegation.includes(team => team === gameweek.relegation[k])) {
                gameweekScores[prediction.name].score += pointValues.relegationPlace;
            }
        }
    }
    predictionTables[gameweek.week] = gameweekScores;
}

console.log(predictionTables);