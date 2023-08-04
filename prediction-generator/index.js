const prompt = require('prompt-sync')({ sigint: true });

const teams = require('./../teams-2021-22.json').data;

let sortedTeams = [...teams.map(team => {
    return {
        name: team,
        score: 0
    }
})];

const totalQuestions = (sortedTeams.length * (sortedTeams.length + 1)) / 2;
let questionNumber = 1;
console.log('total questions: ', (sortedTeams.length * (sortedTeams.length + 1)) / 2);

for (let i = 0; i < teams.length; i++) {
    const teamA = sortedTeams[i];
    for (let j = 0; j < teams.length; j++) {
        const teamB = sortedTeams[j];

        if (teamA.name === teamB.name || i < j) {
            continue;
        }

        console.log(`Question ${questionNumber} of ${totalQuestions}`)

        const answer = prompt(`will ${teamA.name} finish above ${teamB.name}? (Y/N)`);

        const standardisedInput = answer.toString().toLowerCase();

        console.log(standardisedInput);
        if (standardisedInput !== 'y' | standardisedInput !== 'n') {
            console.log('not a valid input, only "y" or "n"');
        }

        if (standardisedInput === 'y') {
            teamA.score++;
        } else {
            teamB.score++;
        }

        questionNumber++;
    }
}

console.table(sortedTeams.sort((a, b) => a.score - b.score));
