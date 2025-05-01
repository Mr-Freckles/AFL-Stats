let games = [];
games = JSON.parse(localStorage.getItem('games')) ?? [];

//collect the current year
let date = new Date();
let currentYear = date.getFullYear();

//set all values to normal when loading
let inputs = [...document.querySelectorAll('.styled-dropdown')];
for (let i in inputs) {
    console.log(inputs[i].value)
    inputs[i].value = '';
    
}


document.getElementById('submit-message').textContent = 'Make sure all boxes are filled to succesfully submit';

//submit function to be called when a new entry is submitted
function submit() {
    //check that all variables have something assigned else return an error message
    for (let i in inputs) {
        console.log(inputs[i].value)
        if (inputs[i].value === '') {
            //change submit message
            document.getElementById('submit-message').textContent = "One of the boxes isn't filled!";
            return;
        }
    }

    //reset submit message
    document.getElementById('submit-message').textContent = 'Make sure all boxes are filled to succesfully submit';

    //run submit code
    let newGame = {gameId: games.length + 1};
    for (let i in inputs) {
        let input = inputs[i];
        newGame[input.id] = input.value;
    }

    //push new game into the array
    games.push(newGame);
    localStorage.setItem('games', JSON.stringify(games)); //save all variables into database
    //reset all variables back to their original state
    for (let i in inputs) {
        inputs[i].value = '';
    }

    basicStats();
    lastGame();
}

//comp consts
const juniorComps = ["VSC (Very Small Children)", "U8", "U9", "U10", "U11", "U12", "U13", "U15", "U17"];
const seniorComps = ["QFA Reserves", "QFA", "QAFL Reserves", "QAFL",  "VFL" , "AFL", "Masters"];
const practiceComps = ["Junior Practice", "Senior Practice"];
const allComps = [...juniorComps, ...seniorComps, ...practiceComps];
const grounds = document.getElementById('ground-options');
const allGrounds = Array.from(grounds.options).map(option => option.value);

//clubs
const clubs = document.getElementById('home-options');
const allClubs = Array.from(clubs.options).map(option => option.value);

function lastGame() {
    let i = games.length - 1;
    if(games[i]) {
        document.getElementById('last-div').textContent = games[i].division;
        document.getElementById('last-gender').textContent = games[i].gender;
        document.getElementById('last-type').textContent = games[i].type;
        document.getElementById('last-date').textContent = games[i].date;
        document.getElementById('last-comp').textContent = games[i].comp;
        document.getElementById('last-ground').textContent = games[i].ground;
        document.getElementById('last-home').textContent = games[i].home;
        document.getElementById('last-away').textContent = games[i].away;
    } else {
        document.getElementById('last-div').textContent = 'N/A';
        document.getElementById('last-gender').textContent = 'N/A';
        document.getElementById('last-type').textContent = 'N/A';
        document.getElementById('last-date').textContent = 'N/A';
        document.getElementById('last-comp').textContent = 'N/A';
        document.getElementById('last-ground').textContent = 'N/A';
        document.getElementById('last-home').textContent = 'N/A';
        document.getElementById('last-away').textContent = 'N/A';
    }
}

lastGame();

function deleteGame() {
    if(games.length < 2) {
        games = [];
        localStorage.setItem('games', JSON.stringify(games));
        lastGame();
        basicStats();
    } else {
        games.length = games.length - 1;
        console.log(games)
        localStorage.setItem('games', JSON.stringify(games)); //save all variables into database
        lastGame();
        basicStats();
    }
    
}

//find the amount of senior games
function basicStats() {
    //set variables for afl wrapped general
    let numSenior = 0;
    let numJunior = 0;
    let practice = 0;
    let numMale = 0;
    let numFemale = 0;
    let mostUmpiredComp;
    let mostUmpiredClub;
    let mostUmpiredTeam;
    let mostUmpiredGround;

    //set variables fro afl wrapped this year
    let yearGames = 0;
    let yearNumSenior = 0;
    let yearNumJunior = 0;
    let yearPractice = 0;
    let yearNumMale = 0;
    let yearNumFemale = 0;
    let mostUmpiredCompYear;
    let mostUmpiredClubYear;
    let mostUmpiredTeamYear;
    let mostUmpiredGroundYear;

    //find stats 
    for (let i = 0; i < games.length; i++) {
        if (seniorComps.includes(games[i].comp)) {
            numSenior++;
        } else if (juniorComps.includes(games[i].comp)) {
            numJunior++;
        } else if (practiceComps.includes(games[i].comp)) {
            practice++;
        }
        if ("Male" === games[i].gender) {
            numMale++;
        } else {
            numFemale++;
        }

        //find stats for this year
        let gameDate = new Date(games[i].date);
        if (gameDate.getFullYear() === currentYear) {
            yearGames++;
            if (seniorComps.includes(games[i].comp)) {
                yearNumSenior++;
            } else if (juniorComps.includes(games[i].comp)) {
                yearNumJunior++;
            } else if (practiceComps.includes(games[i].comp)) {
                yearPractice++;
            }
            if ("Male" === games[i].gender) {
                yearNumMale++;
            } else {
                yearNumFemale++;
            }
        }
    }   

    //most umpired comps
    mostUmpiredComp = getMostStat(allComps, 'comp');
    mostUmpiredCompYear = getMostStat(allComps, 'comp', currentYear);

    //most umpired club
    mostUmpiredClub = getMostStat(allClubs, 'home');
    mostUmpiredClubYear = getMostStat(allClubs, 'home', currentYear);

    //most umpired team
    mostUmpiredTeam = mostTeam();
    mostUmpiredTeamYear = mostTeam(currentYear);

    //
    mostUmpiredGround = getMostStat(allGrounds, 'ground');
    mostUmpiredGroundYear = getMostStat(allGrounds, 'ground', currentYear);
    
    //set stats to show on page
    document.getElementById("total games").textContent = games.length;
    document.getElementById('senior games').textContent = numSenior;
    document.getElementById('junior games').textContent = numJunior;
    document.getElementById('non-practice games').textContent = games.length - practice;
    document.getElementById('male games').textContent = numMale;
    document.getElementById('female games').textContent = numFemale;
    if(mostUmpiredComp === 'N/A') {
        document.getElementById('most-umpired-comp').textContent = mostUmpiredComp;
    } else {
        document.getElementById('most-umpired-comp').textContent = `${mostUmpiredComp[0]}, ${mostUmpiredComp[1]} times`;
    }
    if(mostUmpiredClub === 'N/A') {
        document.getElementById('most-umpired-club').textContent = mostUmpiredClub;
    } else {
        document.getElementById('most-umpired-club').textContent = `${mostUmpiredClub[0]}, ${mostUmpiredClub[1]} times`;
    }
    if(mostUmpiredGround === 'N/A') {
        document.getElementById('most-umpired-ground').textContent = mostUmpiredGround;
    } else {
        document.getElementById('most-umpired-ground').textContent = `${mostUmpiredGround[0]}, ${mostUmpiredGround[1]} times`;
    }
    if(mostUmpiredTeam === 'N/A') {
        document.getElementById('most-umpired-team').textContent = mostUmpiredTeam;
    } else {
        document.getElementById('most-umpired-team').textContent = `${mostUmpiredTeam[0]}, Div ${mostUmpiredTeam[1]}, ${mostUmpiredTeam[2]}, ${mostUmpiredTeam[3]}, ${mostUmpiredTeam[4]} times`;
    }

    document.getElementById("year total games").textContent = yearGames;
    document.getElementById('year senior games').textContent = yearNumSenior;
    document.getElementById('year junior games').textContent = yearNumJunior;
    document.getElementById('year non-practice games').textContent = yearGames - yearPractice;
    document.getElementById('year male games').textContent = yearNumMale;
    document.getElementById('year female games').textContent = yearNumFemale;
    if(mostUmpiredCompYear === 'N/A') {
        document.getElementById('most-umpired-comp-year').textContent = mostUmpiredCompYear;
    } else {
        document.getElementById('most-umpired-comp-year').textContent = `${mostUmpiredCompYear[0]}, ${mostUmpiredCompYear[1]} times`;
    }
    if(mostUmpiredClubYear === 'N/A') {
        document.getElementById('most-umpired-club-year').textContent = mostUmpiredClubYear;
    } else {
        document.getElementById('most-umpired-club-year').textContent = `${mostUmpiredClubYear[0]}, ${mostUmpiredClubYear[1]} times`;
    }
    if(mostUmpiredGroundYear === 'N/A') {
        document.getElementById('most-umpired-ground-year').textContent = mostUmpiredGroundYear;
    } else {
        document.getElementById('most-umpired-ground-year').textContent = `${mostUmpiredGroundYear[0]}, ${mostUmpiredGroundYear[1]} times`;
    }
    if(mostUmpiredTeamYear === 'N/A') {
        document.getElementById('most-umpired-team-year').textContent = mostUmpiredTeamYear;
    } else {
        document.getElementById('most-umpired-team-year').textContent = `${mostUmpiredTeamYear[0]}, Div ${mostUmpiredTeamYear[1]}, ${mostUmpiredTeamYear[2]}, ${mostUmpiredTeamYear[3]}, ${mostUmpiredTeamYear[4]} times`;
    }
}

basicStats();

function checkAFLWrappedStats(i) {
    if (seniorComps.includes(games[i].comp)) {
        yearNumSenior++;
    } else if (juniorComps.includes(games[i].comp)) {
        yearNumJunior++;
    } else if (practiceComps.includes(games[i].comp)) {
        yearPractice++;
    }
    if ("Male" === games[i].gender) {
        yearNumMale++;
    } else {
        yearNumFemale++;
    }
}

function getMostStat(allThings, dataName, year) {
    let mostThing = {}
    let noGameCheck = 0;
    for(let i in allThings) {
        mostThing[allThings[i]] = 0;
    }
    for(let i = 0; i < games.length; i++) {
        if(!year || new Date(games[i].date).getFullYear() === year) {
            mostThing[games[i][dataName]]++;
            noGameCheck = 1;
            }
        if((!year || new Date(games[i].date).getFullYear() === year) && dataName === 'home') {
            mostThing[games[i].away]++;
        }
    } 
    if(noGameCheck) {
        return Object.entries(mostThing).reduce((prev, cur) => cur[1] > prev[1] ? cur : prev);
    } else {
        return 'N/A';
    }
    
}

function mostTeam(year) {
    let topTeam = [];
    let mostUmpiredTeamId;
    if(games.length) {
        for(let i = 0; i < games.length; i++) {
            if(!year || new Date(games[i].date).getFullYear() === year) {
                let newHome = {};
                let newAway = {};
                let comp = (games[i].comp);
                let div = (games[i].division);
                let gender = (games[i].gender);
                if (gender === 'Male') {
                    gender = 'Mens';
                } else {
                    gender = 'Womens';
                }
                let homeClub = (games[i].home);
                let awayClub = (games[i].away);
                let gameAddHome;
                let gameAddAway;

                newHome = {number: 1, comp: comp, div: div, club: homeClub, gender: gender};
                newAway = {number: 1, comp: comp, div: div, club: awayClub, gender: gender};
                
                if(topTeam.length === 0) {
                    if(newHome.club === newAway.club) {
                        newHome.number = 2;
                        topTeam.push(newHome);
                    } else {
                        topTeam.push(newHome);
                        topTeam.push(newAway);
                    }            
                } else {
                    for(let i = 0; i < topTeam.length; i++) {
                        if(newHome.comp === topTeam[i].comp && newHome.div === topTeam[i].div && newHome.club === topTeam[i].club && newHome.gender === topTeam[i].gender) {
                            gameAddHome = i;
                            
                        } 
                        if(newAway.comp === topTeam[i].comp && newAway.div === topTeam[i].div && newAway.club === topTeam[i].club && newAway.gender === topTeam[i].gender) {
                            gameAddAway = i
                            
                        } 
                    }
                    if(gameAddHome + 1) {
                        topTeam[gameAddHome].number++;
                    } else {
                        topTeam.push(newHome);
                    }
                    if(gameAddAway + 1) {
                        topTeam[gameAddAway].number++;
                    } else {
                        topTeam.push(newAway);
                    }
                }
            }
            let mostTeamAmount = 0;
            for(let i = 0; i < topTeam.length; i++) {
                if(mostTeamAmount < topTeam[i].number) {
                    if(topTeam[i].comp !== 'Senior Practice' && topTeam[i].comp !== 'Junior Practice') {
                        mostTeamAmount = topTeam[i].number;
                        mostUmpiredTeamId = i;
                    }                 
                }
            }
        }
        
        if(mostUmpiredTeamId + 1) {
            return [topTeam[mostUmpiredTeamId].comp, topTeam[mostUmpiredTeamId].div, topTeam[mostUmpiredTeamId].gender, topTeam[mostUmpiredTeamId].club, topTeam[mostUmpiredTeamId].number];
        } else {
            return "N/A";
        }
    } else {
        return "N/A";
    }
    
}

//function to find how many games have a specific statistic
function callGame() {
    //get chosen stats
    let yearStat1 = document.getElementById('year-stats1').value;
    let yearStat2 = document.getElementById('year-stats2').value;
    let divisionStat = document.getElementById('division-stats').value;
    let ageStat = document.getElementById('age-stats').value;
    let compStat = document.getElementById('comp-stats').value;
    let genderStat = document.getElementById('gender-stats').value;
    let groundStat = document.getElementById('ground-stats').value;

    //see if box is checked
    let yearCheck = document.getElementById('year-checkbox');
    let divisionCheck = document.getElementById('division-checkbox');
    let ageCheck = document.getElementById('age-checkbox');
    let compCheck = document.getElementById('comp-checkbox');
    let genderCheck = document.getElementById('gender-checkbox');
    let groundCheck = document.getElementById('ground-checkbox');

    //set boolean values
    let yearBoolean = false;
    let divisionBoolean = false;
    let ageBoolean = false;
    let compBoolean = false;
    let genderBoolean = false;
    let groundBoolean = false;
    let senior = false;

    let statNum = 0;
    //find if game fits with stat
    for (let i = 0; i < games.length; i++) {
        let gameDate = new Date(games[i].date);
        if (games[i].division === divisionStat) {
            divisionBoolean = true;
        } else {
            divisionBoolean = false;
        }
        if (gameDate.getFullYear().toString() >= yearStat1 && gameDate.getFullYear().toString() <= yearStat2) {
            yearBoolean = true;
        } else {
            yearBoolean = false;
        }
        if ([...seniorComps, "Senior Practice"].includes(games[i].comp)) {
            senior = true;
        } else if ([...juniorComps, "Junior Pratice"].includes(games[i].comp)) {
            senior = false;
        }
        if ((senior && ageStat === 'Senior') || (!senior && ageStat === 'Junior')) {
            ageBoolean = true;
        } else {
            ageBoolean = false;
        }
        if (games[i].comp === compStat) {
            compBoolean = true;
        } else {
            compBoolean = false;
        }
        if (games[i].gender === genderStat) {
            genderBoolean = true;
        } else {
            genderBoolean = false;
        }
        if(games[i].ground === groundStat) {
            groundBoolean = true;
        }
        if ((groundBoolean || !groundCheck.checked) && (yearBoolean || !yearCheck.checked) && (divisionBoolean || !divisionCheck.checked) && (ageBoolean || !ageCheck.checked) && (compBoolean || !compCheck.checked) && (genderBoolean || !genderCheck.checked)) {
            statNum++;
        }
    }
    document.getElementById('call-game-stat').textContent = statNum;
}

compare()
//function for comparing yearly stats or monthly stats 
function compare() {   
    //set variables
    let yearStat1 = document.getElementById('primary-year-stats1').value;
    let yearStat2 = document.getElementById('primary-year-stats2').value;
    let divisionStat = document.getElementById('primary-division-stats').value;
    let ageStat = document.getElementById('primary-age-stats').value;
    let compStat = document.getElementById('primary-comp-stats').value;
    let genderStat = document.getElementById('primary-gender-stats').value;
    let groundStat = document.getElementById('primary-ground-stats').value;

    //see if box is checked
    let yearCheck = document.getElementById('primary-year-checkbox');
    let divisionCheck = document.getElementById('primary-division-checkbox');
    let ageCheck = document.getElementById('primary-age-checkbox');
    let compCheck = document.getElementById('primary-comp-checkbox');
    let genderCheck = document.getElementById('primary-gender-checkbox');
    let groundCheck = document.getElementById('primary-ground-checkbox');

    //set boolean values
    let yearBoolean = false;
    let divisionBoolean = false;
    let ageBoolean = false;
    let compBoolean = false;
    let genderBoolean = false;
    let groundBoolean = false;
    let senior = false;

    let statNum = 0;
    //find if game fits with stat
    for (let i = 0;i < games.length; i++) {
        let gameDate = new Date(games[i].date);
        if (games[i].division === divisionStat) {
            divisionBoolean = true;
        } else {
            divisionBoolean = false;
        }
        if (gameDate.getFullYear().toString() >= yearStat1 && gameDate.getFullYear().toString() <= yearStat2) {
            yearBoolean = true;
        } else {
            yearBoolean = false;
        }
        if ([...juniorComps, "Junior Practice"].includes(games[i].comp)) {
            senior = false;
        } else if ([...seniorComps, "Senior Practice"].includes(games[i].comp)) {
            senior = true;
        }
        if ((senior && ageStat === 'Senior') || (!senior && ageStat === 'Junior')) {
            ageBoolean = true;
        } else {
            ageBoolean = false;
        }
        if (games[i].comp === compStat) {
            compBoolean = true;
        } else {
            compBoolean = false;
        }
        if (games[i].gender === genderStat) {
            genderBoolean = true;
        } else {
            genderBoolean = false;
        }
        if(games[i].ground === groundStat) {
            groundBoolean = true;
        }
        if ((groundBoolean || !groundCheck.checked) && (yearBoolean || !yearCheck.checked) && (divisionBoolean || !divisionCheck.checked) && (ageBoolean || !ageCheck.checked) && (compBoolean || !compCheck.checked) && (genderBoolean || !genderCheck.checked)) {
            statNum++;
        }
    }
    document.getElementById('first-compare-game-stat').textContent = statNum;
    let firstNum = statNum;

    //set variables
    yearStat1 = document.getElementById('secondary-year-stats1').value;
    yearStat2 = document.getElementById('secondary-year-stats2').value;
    divisionStat = document.getElementById('secondary-division-stats').value;
    ageStat = document.getElementById('secondary-age-stats').value;
    compStat = document.getElementById('secondary-comp-stats').value;
    genderStat = document.getElementById('secondary-gender-stats').value;
    groundStat = document.getElementById('secondary-ground-stats').value;

    //see if box is checked
    yearCheck = document.getElementById('secondary-year-checkbox');
    divisionCheck = document.getElementById('secondary-division-checkbox');
    ageCheck = document.getElementById('secondary-age-checkbox');
    compCheck = document.getElementById('secondary-comp-checkbox');
    genderCheck = document.getElementById('secondary-gender-checkbox');
    groundCheck = document.getElementById('secondary-ground-checkbox');

    //set boolean values
    yearBoolean = false;
    divisionBoolean = false;
    ageBoolean = false;
    compBoolean = false;
    genderBoolean = false;
    groundBoolean = false;
    senior = false;

    statNum = 0;
    for (let i = 0;i < games.length; i++) {
        let gameDate = new Date(games[i].date);
        if (games[i].division === divisionStat) {
            divisionBoolean = true;
        } else {
            divisionBoolean = false;
        }
        if (gameDate.getFullYear().toString() >= yearStat1 && gameDate.getFullYear().toString() <= yearStat2) {
            yearBoolean = true;
        } else {
            yearBoolean = false;
        }
        if ([...juniorComps, "Junior Practice"].includes(games[i].comp)) {
            senior = false;
        } else if ([...seniorComps, "Senior Practice"].includes(games[i].comp)) {
            senior = true;
        }
        if ((senior && ageStat === 'Senior') || (!senior && ageStat === 'Junior')) {
            ageBoolean = true;
        } else {
            ageBoolean = false;
        }
        if (games[i].comp === compStat) {
            compBoolean = true;
        } else {
            compBoolean = false;
        }
        if (games[i].gender === genderStat) {
            genderBoolean = true;
        } else {
            genderBoolean = false;
        }
        if(games[i].ground === groundStat) {
            groundBoolean = true;
        }
        if ((groundBoolean || !groundCheck.checked) && (yearBoolean || !yearCheck.checked) && (divisionBoolean || !divisionCheck.checked) && (ageBoolean || !ageCheck.checked) && (compBoolean || !compCheck.checked) && (genderBoolean || !genderCheck.checked)) {
            statNum++;
        }
    }
    document.getElementById('second-compare-game-stat').textContent = statNum;
    let secondNum = statNum
    document.getElementById('difference-compare').textContent = Math.abs(firstNum - secondNum);
}

//for graphing
let myGraph;

function graph() {
    if (myGraph) {
        myGraph.destroy();
      }
    //set variables
    let yearStat1 = +document.getElementById('graph-year-stats1').value;
    let yearStat2 = +document.getElementById('graph-year-stats2').value;
    let yearArray = [];
    let statArray = [];
    for(let i = yearStat1; i < yearStat2 + 1; i++) {
        yearArray.push(i.toString())
    }

    let divisionStat = document.getElementById('graph-division-stats').value;
    let ageStat = document.getElementById('graph-age-stats').value;
    let compStat = document.getElementById('graph-comp-stats').value;
    let genderStat = document.getElementById('graph-gender-stats').value;
    let groundStat = document.getElementById('graph-ground-stats').value;

    //see if box is checked
    let divisionCheck = document.getElementById('graph-division-checkbox');
    let ageCheck = document.getElementById('graph-age-checkbox');
    let compCheck = document.getElementById('graph-comp-checkbox');
    let genderCheck = document.getElementById('graph-gender-checkbox');
    let groundCheck = document.getElementById('graph-ground-checkbox');

    //set boolean values
    let yearBoolean = false;
    let divisionBoolean = false;
    let ageBoolean = false;
    let compBoolean = false;
    let genderBoolean = false;
    let groundBoolean = false;
    let senior = false;

    let statNum = 0;
    //find if game fits with stat
    for(let j = 0; j < yearArray.length; j++) {
        statNum = 0;
        for (let i = 0; i < games.length; i++) {
            let gameDate = new Date(games[i].date);
            if (games[i].division === divisionStat) {
                divisionBoolean = true;
            } else {
                divisionBoolean = false;
            }
            if (gameDate.getFullYear().toString() === yearArray[j]) {
                yearBoolean = true;
            } else {
                yearBoolean = false;
            }
            if ([...juniorComps, "Junior Practice"].includes(games[i].comp)) {
                senior = false;
            } else if ([...seniorComps, "Senior Practice"].includes(games[i].comp)) {
                senior = true;
            }
            if ((senior && ageStat === 'Senior') || (!senior && ageStat === 'Junior')) {
                ageBoolean = true;
            } else {
                ageBoolean = false;
            }
            if (games[i].comp === compStat) {
                compBoolean = true;
            } else {
                compBoolean = false;
            }
            if (games[i].gender === genderStat) {
                genderBoolean = true;
            } else {
                genderBoolean = false;
            }
            if(games[i].ground === groundStat) {
                groundBoolean = true;
            }
            if ((groundBoolean || !groundCheck.checked) && (yearBoolean) && (divisionBoolean || !divisionCheck.checked) && (ageBoolean || !ageCheck.checked) && (compBoolean || !compCheck.checked) && (genderBoolean || !genderCheck.checked)) {
                statNum++;
            }
        }
        statArray.push(statNum)
    }

    const ctx = document.getElementById('myChart');

    myGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearArray,
            datasets: [{
            label: 'Number of Games',
            data: statArray,
            borderWidth: 1
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
    });
}

graph();

function downloadStats(filename = 'data.json') {
    const blob = new Blob([JSON.stringify(games, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function uploadStats() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
  
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsedData = JSON.parse(reader.result);
          if (Array.isArray(parsedData)) {
            games = parsedData;
            console.log('Games array updated:', games);
          } else {
            console.error('JSON file does not contain an array');
          }
        } catch (error) {
          console.error('Invalid JSON file', error);
        }
      };
      reader.readAsText(file);
    };
  
    input.click();
    lastGame();
}

function removeGames() {
    localStorage.clear();
    games = [];
    console.log(games);
}