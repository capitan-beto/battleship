import {  machineCoords, y, x } from "./data";

export function Ships(type, size, hits, sink) {
    this.type = type;
    this.size = size; 
    this.hits = hits;
    this.sink = sink;
    
    this.isSunk = () => {
        if (this.hits == this.size) this.sink = true;
    };
}

export function Gameboard(ship, coords, hit) {
    
    if(ship == "AC") this.ship = new Ships("Aircraft Carrier", 5, 0, false);
    else if (ship == "BS") this.ship = new Ships("Battleship", 4, 0, false);
    else if (ship == "CR") this.ship = new Ships("Cruiser", 3, 0, false);
    else if (ship == "DT") this.ship = new Ships("Destroyer", 2, 0, false);

    
    this.coords = coords;

    this.receiveAttack = (hit) => {
        if (this.coords.some(x => x == hit)){
            this.ship.hits += 1;
            // console.log("Hit!")
            return true;
        }
        // console.log("Miss!")
        return false;
    };

    this.reportSink = () => {
        this.ship.isSunk();
        if (this.ship.sink == true)  return console.log(`This ${this.ship.type} is wrecked!`);
        return console.log(`This ship still can fight!`);
    }
    
}

export function match(arrPlayer, arrMachine) {
    let count;

    const playerFleet = {
        ac: new Gameboard("AC", arrPlayer[0]),
        bs: new Gameboard("BS", arrPlayer[1]),
        cr: new Gameboard("CR", arrPlayer[2]),
        dtOne: new Gameboard("DT", arrPlayer[3]),
        dtTwo: new Gameboard("DT", arrPlayer[4]),
    }

    const machineFleet = {
        ac: new Gameboard("AC", arrMachine[0]),
        bs: new Gameboard("BS", arrMachine[1]),
        cr: new Gameboard("CR", arrMachine[2]),
        dtOne: new Gameboard("DT", arrMachine[3]),
        dtTwo: new Gameboard("DT", arrMachine[4]),
    }

    const machineChoice = () => {
        
        function selectAttack(lastHit) {
            if (!lastHit.state) {
                console.log("to random");
                randomChoice(x, y);
                visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
            }else {
                console.log("to adjacent");
                adjacentChoice(x, y);
                visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
            };
        }
        

        let y = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
        let x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let visited = [];

        //try exporting to exec adjacent
        const lastHit = {
            coordsy: null, 
            coordsx: null, 
            state: false,
            fnIndex : 0,
        }

        let randomChoice = (x, y) =>  {
            let random = () => (Math.floor(Math.random() * 10));
            let randomy = random();
            let randomx = random();
            visited.push(y[randomy] + x[randomx])

            if(attack(playerFleet, (y[randomy] + x[randomx]))){
                console.log(`Hit to player at ${y[randomy] + x[randomx]}`)
                lastHit.coordsy = randomy;
                lastHit.coordsx = randomx;
                lastHit.state = true;
                return true;
            }
        }

        let adjacentChoice = (x, y) => {
            let hitCount = 0;
            let randomAdjacent = () => (Math.floor(Math.random() * 4));
            if (hitCount == 0) {
                let index = randomAdjacent();
                adjMoves[index](); 
                visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
                if(attack(playerFleet, (y[lastHit.coordsy] + x[lastHit.coordsx]))){
                    lastHit.fnIndex = index;   
                    hitCount = 1;
                } else return;

            } else if (hitCount == 1) {
                adjMoves[lastHit.fnIndex]();
                visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
                if (attack(playerFleet, (y[lastHit.coordsy] + x[lastHit.coordsx]))) {
                    return;
                } else {
                    hitCount = -1;
                }

            } else if (hitCount == -1) {
                if (lastHit.fnIndex == 0) {
                    adjMoves[2]();
                    visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
                    if (attack(playerFleet, (y[lastHit.coordsy] + x[lastHit.coordsx]))){
                        hitCount = 1;
                    } else return;

                } else if (lastHit.fnIndex == 1) {
                    adjMoves[3]();
                    visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
                    if (attack(playerFleet, (y[lastHit.coordsy] + x[lastHit.coordsx]))){
                        hitCount = 1;
                    } else return;
                
                } else if (lastHit.fnIndex == 2) {
                    adjMoves[0]();
                    visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
                    if (attack(playerFleet, (y[lastHit.coordsy] + x[lastHit.coordsx]))){
                        hitCount = 1;
                    } else return;

                } else if (lastHit.fnIndex == 3) {
                    adjMoves[1]();
                    visited.push(y[lastHit.coordsy] + x[lastHit.coordsx]);
                    if (attack(playerFleet, (y[lastHit.coordsy] + x[lastHit.coordsx]))){
                        hitCount = 1;
                    } else return;
                }
            }
            
        }

        const adjMoves = [
            //edit to contemplate visited
            () => {
                if(checkVisited()) lastHit.coordsy++;
            },
            () => lastHit.coordsx++,
            () => lastHit.coordsy--,
            () => lastHit.coordsx--
        ]
        
        const checkVisited = () => {
            if (visited.includes(y[lastHit.coordsy] + x[lastHit.coordsx]) ||
             y[lastHit.coordsx] == 0 || x[lastHit.coordsx ] == 0){
                return false;
            } else {
                return true;
            }
        }
        
        selectAttack(lastHit);
        return lastHit;
    };
    
    function triggerPlayerAttack() {
        document.querySelector(".machine").addEventListener("click",
        (e) => {
            attack(machineFleet, e.target.className);
            machineChoice();
        });
    }
    
    triggerPlayerAttack();
    // machineChoice()
} 


function attack(enemy, coords){
    let hit = false;
    for (let [key, value] of Object.entries(enemy)){
        if(value.receiveAttack(coords)) {
            console.log("hit!")
            value.reportSink()
            hit = true;
        }
    }
    if (hit!== true) console.log("Miss!");
    
    return hit;      
}

// const playerCoords = [
//     ['i2', 'i3', 'i4', 'i5', 'i6'],
//     ['g6', 'g7', 'g8', 'g9'],
//     ['g2', 'f2', 'e2'],
//     ['e4', 'e5'],
//     ['d8', 'c8']
// ]

//fix the adjMoves to avoid making moves out of the table.
//Create previous hit arr to 

//Create an array for the machine
//Test the attack function with both player and machine.
//Create basic grid to set fleet of elements there.
//Create function that allows player take turns.
//Create logic of IA of computer. 
//Create messages to display while playing.
//Pay attention to the messages displayed as strings among the objects

//the selector of of random choice or adjacentchoice must take as parameter the
//lastHit.state.

// console.log(match(playerCoords, machineCoords))