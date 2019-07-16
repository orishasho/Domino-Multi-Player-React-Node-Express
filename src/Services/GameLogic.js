const _ = require('lodash');
export default class GameLogic {
    startGame(activePlayers, passivePlayers, gameIndex) {
        //1. Create start bank, start hands, start board, start stats
        var playerHandAndBank = {
            startHand: [],
            bankAfterStartHandCreated: this.createStartBank()
        }
        var playersStartHands = [];
        for (let i = 0; i < activePlayers.length; i++) {
            playerHandAndBank = this.createStartHand(playerHandAndBank.bankAfterStartHandCreated);
            playersStartHands.push(playerHandAndBank.startHand);
        }
        var startBoard = this.createStartBoard();
        var playersStartStats = [];
        for (let i = 0; i < activePlayers.length; i++) {
            playersStartStats.push(this.createStartStats());
        }
        //2. Post game data to server
        this.postActivePlayers(activePlayers, gameIndex);
        this.postPassivePlayers(passivePlayers, gameIndex);
        this.postStartBank(playerHandAndBank.bankAfterStartHandCreated, gameIndex);
        this.postStartHands(playersStartHands, gameIndex);
        this.postStartBoard(startBoard, gameIndex);
        this.postStartStats(playersStartStats, gameIndex);
        this.postCurrPlayerIndex(gameIndex);
    }

    createStartBank() {   
        var startBank = [], dominoTile;
        //1. create tiles of (0,x) form:
        for (let i = 0; i <= 6; i++) {
            dominoTile = {firstNum: 0, secondNum: i}
            startBank.push(dominoTile);
        }
        //2. create tiles of (1,x) form without (1,0):
        for (let i = 1; i <= 6; i++) {
            dominoTile = {firstNum: 1, secondNum: i}
            startBank.push(dominoTile);
        }
        //3. create tiles of (2,x) form without (2,0) and (2,1)
        for (let i = 2; i <= 6; i++) {
            dominoTile = {firstNum: 2, secondNum: i}
            startBank.push(dominoTile);
        }
        //4. create tiles of (3,x) form without (3,0) and (3,1) and (3,2)
        for (let i = 3; i <= 6; i++) {
            dominoTile = {firstNum: 3, secondNum: i}
            startBank.push(dominoTile);
        }
        //5. create tiles of (4,x) form wihtout (4,0) and (4,1) and (4,2) and (4,3)
        for (let i = 4; i <= 6; i++) {
            dominoTile = {firstNum: 4, secondNum: i}
            startBank.push(dominoTile);
        }
        //6. create remaining tiles: (5,5) , (5,6) , (6,6)
        dominoTile = {firstNum: 5, secondNum: 5}
        startBank.push(dominoTile);
        dominoTile = {firstNum: 5, secondNum: 6}
        startBank.push(dominoTile);
        dominoTile = {firstNum: 6, secondNum: 6}
        startBank.push(dominoTile);
        startBank = this.shuffleBank(startBank);
        return startBank;
    }

    shuffleBank(bank) {
        var currentIndex = bank.length, temporaryValue, randomIndex;
      
        //While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          //Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          //And swap it with the current element.
          temporaryValue = bank[currentIndex];
          bank[currentIndex] = bank[randomIndex];
          bank[randomIndex] = temporaryValue;
        }
        return bank;
    }

    postActivePlayers(activePlayers, gameIndex) {
        const dataToUpdate = {
            gameIndex: gameIndex,
            activePlayers: _.cloneDeep(activePlayers)
        };
        fetch('/singleGame/addActivePlayers', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Active players posted successfuly');
            }
            else {
                console.log('Error in posting active players');
            }
        });
    }

    postPassivePlayers(passivePlayers, gameIndex) {
        const dataToUpdate = {
            gameIndex: gameIndex,
            passivePlayers: _.cloneDeep(passivePlayers)
        };
        fetch('/singleGame/addPassivePlayers', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Passive players posted successfuly');
            }
            else {
                console.log('Error in posting passive players');
            }
        });
    }

    removePassivePlayer(playerName, gameIndex) {
        const dataToUpdate = {
            gameIndex: gameIndex,
            playerName: playerName
        };
        fetch('/singleGame/removePassivePlayer', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Passive player removed successfuly');
            }
            else {
                console.log('Error in removing passive player');
            }
        });
    }

    postStartBank(bank, gameIndex) {
        const dataToUpdate = {
            startBank: _.cloneDeep(bank),
            gameIndex: gameIndex
        };
        fetch('/singleGame/addStartBank', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Start bank posted successfuly');
            }
            else {
                console.log('Error in posting start bank');
            }
        });
    }

    postStartHands(hands, gameIndex) {
        const dataToUpdate = {
            startHands: _.cloneDeep(hands),
            gameIndex: gameIndex
        };
        fetch('/singleGame/addStartHands', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Start hands posted successfuly');
            }
            else {
                console.log('Error in posting start hands');
            }
        });
    }

    postStartBoard(board, gameIndex) {
        const dataToUpdate = {
            startBoard: _.cloneDeep(board),
            gameIndex: gameIndex
        };
        fetch('/singleGame/addStartBoard', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Start board posted successfuly');
            }
            else {
                console.log('Error in posting start board');
            }
        });
    }

    postStartStats(stats, gameIndex) {
        const dataToUpdate = {
            startStats: _.cloneDeep(stats),
            gameIndex: gameIndex
        };
        fetch('/singleGame/addStartStats', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Start stats posted successfuly');
            }
            else {
                console.log('Error in posting start stats');
            }
        });
    }

    removeDominoFromHand(dominoToRemove, currHand) {
        //Removes a given domino from the current hand, returns hand after removal
        var i = 0, currDomino, newHand;
        newHand = _.cloneDeep(currHand);
        //1. Search hand for the domino to remove
        currDomino = newHand[0];
        while (i < newHand.length && currDomino.firstNum !== dominoToRemove.firstNum ||
            currDomino.secondNum !== dominoToRemove.secondNum) {
            i++;
            currDomino = newHand[i];
        }
        //2. Remove domino from hand and return updated hand
        newHand.splice(i, 1);
        return newHand;
    }

    createStartBoard() {
        const boardSize = 28;
        var startBoard = new Array(boardSize);

        for (let i = 0; i < boardSize; i++) {
            startBoard[i] = new Array(boardSize);
        }
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                startBoard[i][j] = '';
            }
        }
        return startBoard;
    }

    createStartStats() {
        var startStats = {
            numOfDominosDrawn : 0,
            score : 0,
            numOfMovesPlayed : 0
        }
        return startStats;
    }

    createStartHand(bank) {
        console.log(bank);
        var startHand = [], bankAfterStartHandCreated = bank;
        const startHandLen = 6;

        for (let i = 0; i < startHandLen; i++) {
            startHand.push(bankAfterStartHandCreated[bankAfterStartHandCreated.length - 1]);
            bankAfterStartHandCreated.pop();
        }
        return {startHand, bankAfterStartHandCreated}
    }

    postCurrPlayerIndex(gameIndex) {
        fetch('/singleGame/initCurrPlayerIndex', {method:'POST', body: JSON.stringify(gameIndex), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('initCurrPlayerIndex successfuly');
            }
            else {
                console.log('Error in initCurrPlayerIndex');
            }
        });
    }

    postMaxPlayerIndex(maxPlayerIndex, gameIndex) {
        const dataToUpdate = {
            maxPlayerIndex: maxPlayerIndex,
            gameIndex: gameIndex
        };
        fetch('/singleGame/updateMaxPlayerIndex', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Updated max player index successfuly');
            }
            else {
                console.log('Error in updating max player index');
            }
        });
    }

    postNewDataForDrawTile(bank, hand, stats, currPlayerIndex, gameIndex) {
        var dominoToAddToHand;
        var newData = {
            newBank: _.cloneDeep(bank),
            newHand: _.cloneDeep(hand),
            newStats: {...stats}
        };
        //1. Draw a domino from the bank
        dominoToAddToHand = {
            firstNum: newData.newBank[newData.newBank.length - 1].firstNum,
            secondNum: newData.newBank[newData.newBank.length - 1].secondNum
        }
        newData.newBank.pop();
        newData.newHand.push(dominoToAddToHand);
        //2. Update stats
        newData.newStats.numOfDominosDrawn++;
        newData.newStats.numOfMovesPlayed++;
        newData.newStats = this.calcScore(newData.newStats, newData.newHand);
        //3. Update new data in server
        this.updateDataAfterDraw(newData, currPlayerIndex, gameIndex);
    }

    updateDataAfterDraw(newData, currPlayerIndex, gameIndex) {
        const dataToUpdate = {
            newBank: newData.newBank,
            newHand: newData.newHand,
            newStats: newData.newStats,
            currPlayerIndex: currPlayerIndex,
            gameIndex: gameIndex
        }
        fetch('/singleGame/updateDataAfterDraw', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Data updated after draw successfuly');
            }
            else {
                console.log('Error in updating data after draw');
            }
        });
    }

    postNewDataForFirstMove(boardMid, currBoard, dominoFromHand, currHand, currStats, currPlayerIndex, gameIndex) {
        //1. Get new data for the first move
        var newData = {
            newBoard: _.cloneDeep(currBoard),
            newHand: _.cloneDeep(currHand),
            newStats: {...currStats},
            currPlayerIndex: currPlayerIndex,
            gameIndex: gameIndex
        }
        newData.newBoard[boardMid][boardMid] = {
            firstNum: dominoFromHand.firstNum,
            secondNum: dominoFromHand.secondNum,
            dir: 'row',
            flipped: false
        };
        newData.newHand = _.cloneDeep(this.removeDominoFromHand(dominoFromHand, newData.newHand));
        newData.newStats.numOfMovesPlayed++;
        newData.newStats = this.calcScore(newData.newStats, newData.newHand);
        //2. Update new data in server
        this.updateDataAfterFirstMove(newData);
    }

    updateDataAfterFirstMove(newData) {
        const dataToUpdate = _.cloneDeep(newData);
        fetch('/singleGame/updateDataAfterFirstMove', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Data updated after first move successfuly');
            }
            else {
                console.log('Error in updating data after first move');
            }
        });
    }

    calcScore(currStats, currHand) {
        var newStats = {...currStats};
        newStats.score = 0;
        if (currHand !== []) {
            for (var i = 0; i < currHand.length; i++) {
                newStats.score += currHand[i].firstNum;
                newStats.score += currHand[i].secondNum;
            }
        }
        return newStats;
    }

    checkEveryPlayerForValidMoves(allHands, allStats, board, boardSize, validIndexes, locationsToFlip, currPlayerIndex, gameIndex) {
        var endGame = true;
        var winnerIndex, noValidMoves;
        console.log('Checking valid moves...');
        //1. For every player, check for valid moves
        for (let i = 0; i < allHands.length; i++) {
            noValidMoves = this.checkIfPlayerHasValidMoves(boardSize, allHands[i], validIndexes, locationsToFlip, board);
            if (!noValidMoves) {
                endGame = false;
                break;
            }
        }
        //2. If no valid moves for all players, check which player has lowest score
        if (endGame) {
            winnerIndex = this.checkMinScore(allStats);
            //3. End game and announce winner
            this.updateEndGameWinner(winnerIndex, gameIndex);
        }
        else {
            //4. If only the current player has no moves left, skip his turn
            noValidMoves = this.checkIfPlayerHasValidMoves(boardSize, allHands[currPlayerIndex], validIndexes, locationsToFlip, board);
            if (noValidMoves) {
                console.log('no valid moves for curr player');
                this.skipTurn(gameIndex);
            }
        }
    }

    skipTurn(gameIndex) {
        console.log('skipping client');
        fetch('/singleGame/skipTurn', {method: 'POST', body: JSON.stringify(gameIndex),credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Skipped turn successfuly');
            }
            else {
                console.log('Error in skipping turn');
            }
        });
    }

    checkMinScore(allStats) {
        var minScore = allStats[0].score;
        var minScoreIndex = 0;
        for (let i = 1; i < allStats.length; i++) {
            if (allStats[i].score < minScore) {
                minScore = allStats[i].score;
                minScoreIndex = i;
            }
        }
        return minScoreIndex;
    }

    updateEndGameWinner(winnerIndex, gameIndex) {
        const dataToUpdate = {
            winnerIndex: winnerIndex,
            gameIndex: gameIndex
        }
        fetch('/singleGame/updateEndGameWinner', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Data updated after updateEndGameWinner successfuly');
            }
            else {
                console.log('Error in updating data after updateEndGameWinner');
            }
        });
    }

    checkIfPlayerHasValidMoves(boardLogicSize, currHand, validIndexes, locationsToFlip, currBoard) {
        if (boardLogicSize === 0) {
            return false;
        }
        for (let i = 0; i < currHand.length; i++) {
            for (let j = 0; j < currBoard.length; j++) {
                for (let k = 0; k < currBoard.length; k++) {
                    if (this.checkPlace(j, k, currHand[i], false, true, validIndexes, locationsToFlip, currBoard)) {
                        return false; //There are valid moves left
                    }
                }
            }
        }
        return true;
    }

    postNewDataForSecondMoveHandClick(currBoard, dominoFromHand, gameIndex) {
        var dirToAdd, newData;
        var isDouble = false;
        var newBoardContainer = _.cloneDeep(currBoard);
        var dominoFromHandCopy = {
            firstNum: dominoFromHand.firstNum,
            secondNum: dominoFromHand.secondNum
        }
        var currValidAndFlipIndexes = {
            currValidIndexes: [],
            currLocationsToFlip: []
        }

        for (let i = 0; i < newBoardContainer.length; i++) {
            for (let j = 0; j < newBoardContainer.length; j++) {
                if (newBoardContainer[i][j] !== ''
                && newBoardContainer[i][j].firstNum !== 7) {  
                    if (newBoardContainer[i][j].firstNum === newBoardContainer[i][j].secondNum) {
                        isDouble = true;
                    }
                    currValidAndFlipIndexes = this.checkPlace(
                        i,
                        j,
                        dominoFromHandCopy,
                        isDouble,
                        false,
                        currValidAndFlipIndexes.currValidIndexes,
                        currValidAndFlipIndexes.currLocationsToFlip,
                        newBoardContainer
                    );
                    isDouble = false;
               } 
           }
        }

        for (let k = 0; k < currValidAndFlipIndexes.currValidIndexes.length; k++) {
            dirToAdd = currValidAndFlipIndexes.currValidIndexes[k].dir;
            newBoardContainer[currValidAndFlipIndexes.currValidIndexes[k].i][currValidAndFlipIndexes.currValidIndexes[k].j] = {
                firstNum: 7,
                secondNum: 8,
                dir: dirToAdd,
                flipped: false}
        }

        newData = {
            validIndexes: currValidAndFlipIndexes.currValidIndexes,
            locationsToFlip: currValidAndFlipIndexes.currLocationsToFlip,
            newBoard: newBoardContainer,
            gameIndex: gameIndex
        }
        this.updateDataAfterSecondMoveHandClick(newData);
    }

    updateDataAfterSecondMoveHandClick(newData) {
        const dataToUpdate = _.cloneDeep(newData);
        fetch('/singleGame/updateDataAfterSecondMoveHandClick', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Data updated after second move successfuly');
            }
            else {
                console.log('Error in updating data second first move');
            }
        });
    }

    checkPlace(i, j, dominoFromHand, isDouble, isCheckingLoss, validIndexes, locationsToFlip, currBoard) {
        var newBoardContainer = _.cloneDeep(currBoard);
        var newValidIndexes = _.cloneDeep(validIndexes);
        var newLocationsToFlip = _.cloneDeep(locationsToFlip);
        var dirToAdd, returnObj;
        var dominoFromHandCopy = {
            firstNum: dominoFromHand.firstNum,
            secondNum: dominoFromHand.secondNum
        }

        if (newBoardContainer[i][j].firstNum === newBoardContainer[i][j].secondNum) {
            isDouble = true;
        }
        
        if (newBoardContainer[i][j].dir === "col" && !newBoardContainer[i][j].flipped && !isDouble) {
            if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i + 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                newValidIndexes.push({
                    i: i + 1,
                    j: j,
                    dir: dirToAdd});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i - 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                newValidIndexes.push({
                    i: i - 1,
                    j: j,
                    dir: dirToAdd});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i - 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                newValidIndexes.push({
                    i: i - 1,
                    j: j,
                    dir: dirToAdd});
                
                if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                    newLocationsToFlip.push({i: i - 1, j: j});
                }
            }

            if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i + 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                newValidIndexes.push({
                    i: i + 1,
                    j: j,
                    dir: dirToAdd});             
                if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                    newLocationsToFlip.push({i: i + 1, j: j});
                }
            }
        }
        
        else if (newBoardContainer[i][j].dir === 'row' && !newBoardContainer[i][j].flipped && !isDouble) {

            if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i][j + 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j + 1,
                    dir: dirToAdd});   
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i][j - 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j - 1,
                    dir: dirToAdd}); 
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i][j - 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j - 1,
                    dir: dirToAdd});           
                if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                    newLocationsToFlip.push({i: i, j: j - 1});
                }
            }

            if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i][j + 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j + 1,
                    dir: dirToAdd});
                if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                    newLocationsToFlip.push({i: i, j: j + 1});
                }
            }
        }
        
        else if (newBoardContainer[i][j].flipped
        && newBoardContainer[i][j].dir === 'row'
        && !isDouble) {
            if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.firstNum
                && newBoardContainer[i][j - 1] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                    newValidIndexes.push({
                        i: i,
                        j: j - 1,
                        dir: dirToAdd});

                    if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                        newLocationsToFlip.push({i: i, j: j - 1});
                    }
                }
    
                if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
                && newBoardContainer[i][j + 1] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                    newValidIndexes.push({
                        i: i,
                        j: j + 1,
                        dir: dirToAdd});

                    if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                        newLocationsToFlip.push({i: i, j: j + 1});
                    }
                }
    
                if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
                && newBoardContainer[i][j + 1] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                    newValidIndexes.push({
                        i: i,
                        j: j + 1,
                        dir: dirToAdd});
                }
    
                if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.secondNum
                && newBoardContainer[i][j - 1] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'col' : dirToAdd = 'row';
                    newValidIndexes.push({
                        i: i,
                        j: j - 1,
                        dir: dirToAdd});
                }
        }
        
        else if (newBoardContainer[i][j].flipped
        && newBoardContainer[i][j].dir === 'col'
        &&!isDouble) {

            if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.firstNum
                && newBoardContainer[i - 1][j] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                    newValidIndexes.push({
                        i: i - 1,
                        j: j,
                        dir: dirToAdd});

                    if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                        newLocationsToFlip.push({i: i - 1, j: j});
                    }
                }
    
                if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
                && newBoardContainer[i + 1][j] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                    newValidIndexes.push({
                        i: i + 1,
                        j: j,
                        dir: dirToAdd});
               
                    if (dominoFromHandCopy.firstNum !== dominoFromHandCopy.secondNum) {
                        newLocationsToFlip.push({i: i + 1, j: j});
                    }
                }
    
                if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
                && newBoardContainer[i + 1][j] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                    newValidIndexes.push({
                        i: i + 1,
                        j: j,
                        dir: dirToAdd});
                }
    
                if (newBoardContainer[i][j].secondNum === dominoFromHandCopy.secondNum
                && newBoardContainer[i - 1][j] === '') {
                    if (isCheckingLoss) {
                        return true;
                    }
                    dominoFromHandCopy.firstNum === dominoFromHandCopy.secondNum ? dirToAdd = 'row' : dirToAdd = 'col';
                    newValidIndexes.push({
                        i: i - 1,
                        j: j,
                        dir: dirToAdd});
                }
        }
        
        else if (newBoardContainer[i][j].dir === 'col' && isDouble) {

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i][j + 1] === '') { 
                if (isCheckingLoss) {
                    return true;
                }   
            dirToAdd = 'row';
            newValidIndexes.push({
                i: i,
                j: j + 1,
                dir: dirToAdd});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i][j - 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j - 1,
                    dir: dirToAdd});             
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i][j + 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j + 1,
                    dir: dirToAdd});
                newLocationsToFlip.push({i: i, j: j + 1});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i][j - 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j - 1,
                    dir: dirToAdd});
                newLocationsToFlip.push({i: i, j: j - 1});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i - 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i - 1,
                    j: j,
                    dir: dirToAdd});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i + 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i + 1,
                    j: j,
                    dir: dirToAdd});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i - 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i - 1,
                    j: j,
                    dir: dirToAdd});
                newLocationsToFlip.push({i: i - 1, j: j});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i + 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i + 1,
                    j: j,
                    dir: dirToAdd});
                newLocationsToFlip.push({i: i + 1, j: j});
            } 
        }
        
        else if (newBoardContainer[i][j].dir === 'row' && isDouble) {

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i][j + 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j + 1,
                    dir: dirToAdd});
            }

            if(newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i][j - 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j - 1,
                    dir: dirToAdd});
            }

            if(newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i][j + 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j + 1,
                    dir: dirToAdd});
                newLocationsToFlip.push({i: i, j: j + 1});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i][j - 1] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'row';
                newValidIndexes.push({
                    i: i,
                    j: j - 1,
                    dir: dirToAdd});
                newLocationsToFlip.push({i: i, j: j - 1});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i - 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i - 1,
                    j: j,
                    dir: dirToAdd});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i + 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i + 1,
                    j: j,
                    dir: dirToAdd});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.firstNum
            && newBoardContainer[i - 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i - 1,
                    j: j,
                    dir: dirToAdd});
                newLocationsToFlip.push({i: i - 1, j: j});
            }

            if (newBoardContainer[i][j].firstNum === dominoFromHandCopy.secondNum
            && newBoardContainer[i + 1][j] === '') {
                if (isCheckingLoss) {
                    return true;
                }
                dirToAdd = 'col';
                newValidIndexes.push({
                    i: i + 1,
                    j: j,
                    dir: dirToAdd});                
                newLocationsToFlip.push({i: i + 1, j: j});
            }
        }
        if (isCheckingLoss) {
            return false;
        }
        returnObj = {
            currValidIndexes: newValidIndexes,
            currLocationsToFlip: newLocationsToFlip
        }

        return returnObj;
    }

    isNewDominoFlipped(locationsToFlip, iParam, jParam) {
        for(let k = 0; k < locationsToFlip.length; k++) {
            if (locationsToFlip[k].i === iParam && locationsToFlip[k].j === jParam) {
                return true;
            }
        }
        return false;
    }

    isBoardClickValid(validIndexes, iParam, jParam) {
        for (let k = 0; k < validIndexes.length; k++) {
            if (validIndexes[k].i === iParam && validIndexes[k].j === jParam) {
                return true;
            }
        }
        return false;
    }

    cleanYellowDominos(boardContainer, validIndexes, gameIndex) {
        var dataToUpdate = {
            newBoard: _.cloneDeep(boardContainer),
            gameIndex: gameIndex
        };
        //1. Clean yellows from board
        for (let k = 0; k < validIndexes.length; k++) {
            if (dataToUpdate.newBoard[validIndexes[k].i][validIndexes[k].j].firstNum === 7) {
                dataToUpdate.newBoard[validIndexes[k].i][validIndexes[k].j] = '';
            }
        }
        //2. Update board in server
        fetch('/singleGame/cleanYellowDominos', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Cleaned yellow dominos successfuly');
            }
            else {
                console.log('Error in cleaning yellow dominos');
            }
        });
    }

    postNewDataForBoardClick(
        board,
        validIndexes,
        dominoToAdd,
        iParam,
        jParam,
        currHand,
        currStats,
        boardSize,
        locationsToFlip,
        currPlayerIndex,
        winnerIndex,
        activePlayers,
        currPlayerName,
        gameIndex) {
        var newData = {
            newBoard: _.cloneDeep(board),
            newHand: _.cloneDeep(currHand),
            newStats: {...currStats},
            newBoardSize: boardSize + 1,
            currPlayerIndex: currPlayerIndex,
            endGame: false,
            winnerIndex: winnerIndex,
            secondPlaceIndex: null,
            activePlayers: _.cloneDeep(activePlayers),
            gameIndex: gameIndex
        };
        var newDomino = {
            firstNum: dominoToAdd.firstNum,
            secondNum: dominoToAdd.secondNum,
            dir: newData.newBoard[iParam][jParam].dir,
            flipped: this.isNewDominoFlipped(locationsToFlip, iParam, jParam)
        };
        newData.newBoard[iParam][jParam] = newDomino;
        newData.newBoard = this.cleanYellowDominos(newData.newBoard, validIndexes, gameIndex);
        newData.newHand = this.removeDominoFromHand(newDomino, newData.newHand);
        newData.newStats.numOfMovesPlayed++;
        newData.newStats = this.calcScore(newData.newStats, newData.newHand);
        //Check for win
        console.log(`HAND AFTER BOARD CLICK: ${newData.newHand}`);
        if (!newData.newHand || newData.newHand.length === 0) {
            if (winnerIndex === null) { // First player to finish hand
                console.log('IN WIN GAME');
                if (activePlayers.length === 2) { // 2 players game
                    newData.endGame = true;
                }
                newData.winnerIndex = currPlayerIndex;
                newData.activePlayers.splice(newData.activePlayers.indexOf(currPlayerName), 1);
            }
            else { // 3 players game, second player to finish hand
                newData.endGame = true;
                newData.secondPlaceIndex = currPlayerIndex;
                newData.activePlayers.splice(newData.activePlayers.indexOf(currPlayerName), 1);
            }
        }
        this.updateDataAfterBoardClick(newData);
    }

    updateDataAfterBoardClick(newData) {
        const dataToUpdate = _.cloneDeep(newData);
        console.log(`WINNER INDEX IN UPDATE: ${dataToUpdate.winnerIndex}`);
        console.log(`SECOND PLACE INDEX IN UPDATE: ${dataToUpdate.secondPlaceIndex}`);
        fetch('/singleGame/updateDataAfterBoardClick', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('Data updated after board click successfuly');
            }
            else {
                console.log('Error in updating data after board click');
            }
        });
    }
}