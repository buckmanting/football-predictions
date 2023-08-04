const xmasTable = require('./tables/christmas.json').teams;
const finalTable = require('./tables/final.json').teams;
const participants = require('./predictions.json').participants;

const results = [];

const getScore = (prediction, position, isHalfway) => {
    /*
    Three points for the correct winner
    Two points for each placed prediction 2nd-5th (CL and EL places)
    One point per correct place for 6th-17th
    Half a point if one place off
    Two points per relegation place, bonus point if the correct place
    */

    if (position === 0) { // champion
        const pointsOnOffer = 3;

        const teamAtPosition = isHalfway ? xmasTable[position] : finalTable[position];

        const isMatch = teamAtPosition.toLowerCase() === prediction.toLowerCase();

        return isMatch ? pointsOnOffer : 0;
    } else if (position > 0 && position < 5) { // european places
        const pointsOnOffer = 2;

        const teamAtPosition = isHalfway ? xmasTable[position] : finalTable[position];

        const isMatch = teamAtPosition.toLowerCase() === prediction.toLowerCase();

        return isMatch ? pointsOnOffer : 0;
    } else if (position >= 5 && position < 17) { // normal places
        const pointsOnOffer = 1;
        const pointsOnOfferForNearby = 0.5;

        const teamAtPosition = isHalfway ? xmasTable[position] : finalTable[position];

        const isMatch = teamAtPosition.toLowerCase() === prediction.toLowerCase();
        if (isMatch) {
            return pointsOnOffer;
        }

        const teamBefore = isHalfway ? xmasTable[position - 1] : finalTable[position - 1];
        const teamAfter = isHalfway ? xmasTable[position + 1] : finalTable[position + 1];

        const isNearMatch = prediction.toLowerCase() === teamBefore.toLowerCase() || prediction.toLowerCase() === teamAfter.toLowerCase();

        if (isNearMatch) {
            return pointsOnOfferForNearby;
        }
    } else if (position >= 17) { // relegation places
        const points = 2;
        const pointsWithBonus = 3;

        const teamAtPosition = isHalfway ? xmasTable[position] : finalTable[position];

        const isMatch = teamAtPosition.toLowerCase() === prediction.toLowerCase();
        if (isMatch) {
            return pointsWithBonus;
        }

        const relegationTeams = [
            isHalfway ? xmasTable[17] : finalTable[17],
            isHalfway ? xmasTable[18] : finalTable[18],
            isHalfway ? xmasTable[19] : finalTable[19]
        ]

        const isNearMatch = relegationTeams.includes(prediction.toLowerCase());

        if (isNearMatch) {
            return points;
        }
    }

    return 0;
}


// loop over participants
for (const participant of participants) {
    let xmasScore = 0;
    let summerScore = 0;
    // loop over the predictions
    for (let i = 0; i < participant.predictions.length; i++) {
        xmasScore += getScore(participant.predictions[i], i, true);
        summerScore += getScore(participant.predictions[i], i, false);
    }

    const score = Math.floor(xmasScore / 2) + summerScore;

    console.log(participant.name, score);
}