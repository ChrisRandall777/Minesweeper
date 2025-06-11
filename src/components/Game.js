import { useState, useEffect } from 'react'
import Settings from './Settings'
let width = 10
let height = 10
let numMinesLeft = 10
let numVisable = 0
let gameOver = false
let board = []
let bombs = new Set()
let settingsHidden = true

function square(){
    this.revealed = false
    this.value = 0
    
}

function Game(){
    let [numMines, setNumMines] = useState(10)
    let [stateHeight, setStateHeight] = useState(10)
    let [stateWidth, setStateWidth] = useState(10)
    
    useEffect(() => {
        document.querySelector("#minesText").innerHTML = "Mines: " + numMines
        numMinesLeft = numMines
    }, [numMines])

    useEffect(() => {
        width = stateWidth
        height = stateHeight
        document.querySelector("#sizeText").innerHTML = "Size: " + height + " x " + width
        document.getElementById("gameBoard").style.setProperty("--numCol", width)
        document.getElementById("gameBoard").style.setProperty("--numRow", height)

        board = []
        for (let i = 0; i < stateHeight; i++) {
            let row = []
            for (let j = 0; j < stateWidth; j++) {
                row.push(new square())
                
            }
            board.push(row)
        }

        let content = ""
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                content += `<div class="square hidden" value="${i*width + j}">0</div>`
            }
        }

        document.querySelector("#gameBoard").innerHTML = content

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                document.querySelector('[value="' + getLoc(i, j) +  '"]').addEventListener('click', (e) => squareClicked(e, numMines))
            }
        }

    }, [stateHeight, stateWidth, numMines])
    
    board = []
    for (let i = 0; i < height; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
            row.push(new square())
            
        }
        board.push(row)
    }

    //let boardLayout = board.map((row, i) => {return row.map((item, j) => {return <div className="square hidden" onClick={(e) => squareClicked(e, numMines)} value={i*width + j} key={i*width + j}>0</div>})})
    
    return (
        <>
        <div id="topPanel">
            <h1 id="sizeText">Size: {height} x {width}</h1>
            <h1 id="topMsg">Minesweeper!</h1>
            <h1 id="minesText">Mines: {numMines}</h1>
            <div id="btnsContainer">
                <button className="topBtn" id="restartButton" onClick={() => startGame(numMines)}>Restart</button>
                <button className="topBtn" id="settingsButton" onClick={changeSettings}>Settings</button>
                {/* <button className="topBtn" id="helpButton">?</button> */}
            </div>
            
        </div>
        
        <div id="gameBoardContainer">
            <div id="gameBoard"></div>
        </div>

        <div id="settingsComponent">
            <Settings setNumMines={setNumMines} setStateHeight={setStateHeight} setStateWidth={setStateWidth} />
        </div>
        

        {/* <iframe id="rickRollVid" width="1252" height="704" src="https://www.youtube.com/embed/xvFZjo5PgG0" title="Rick Roll (Different link + no ads)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
        
        </>
    )
    
}

function squareClicked(e, numMines){
    if(e.target.classList.contains("flagged") || gameOver)
        return;
    let val = parseInt(e.target.attributes.value.value, 10)
    let h = Math.floor(val / width)
    let w = val - h * width

    if(numVisable === 0){
        // gameOver = false
        generateBoard(h, w, numMines)
        changeVisability(h, w)
        document.querySelector("#settingsComponent").style.display = "none"
        document.querySelector("#settingsButton").style.opacity = "0.5"
    } else if(document.querySelector('[value="' + getLoc(h, w) + '"]').classList.contains("hidden")){
        if(board[h][w].value === -1){
            document.querySelector("#topMsg").innerHTML = "YOU LOSE :("
            // bombs.forEach((bombLoc) => {
            //     document.querySelector('[value="' + bombLoc + '"]').classList.add("flagged")
            // })
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if(board[i][j].value === -1)
                        document.querySelector('[value="' + getLoc(i, j) + '"]').classList.add("flagged")
                    else
                        document.querySelector('[value="' + getLoc(i, j) + '"]').classList.remove("flagged")
                }
            }
            gameOver = true
        } else{
            changeVisability(h, w)
            if(numVisable === (height * width - numMines )){
                document.querySelector("#topMsg").innerHTML = "YOU WIN :)"
                
                // document.querySelector("#rickRollVid").style.display = "block"
                // document.querySelector("#rickRollVid").src = "https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1";
                // setTimeout(() => {
                //     document.querySelector("#rickRollVid").style.display = "none"
                // }, 7000)

                bombs.forEach((bombLoc) => {
                    document.querySelector('[value="' + bombLoc + '"]').classList.add("found")
                })
                gameOver = true
            }
        }
    }

}

function generateBoard(h, w, numMines){
    bombs.clear()
    let total = height * width
    
    while(bombs.size !== numMines){
        while(bombs.size !== numMines){
            bombs.add((Math.floor(Math.random() * total)))
        }
        
        bombs.delete(getLoc(h, w))
        let nbors = getNbors(h, w)
        nbors.forEach((nbor) => bombs.delete(getLoc(nbor[0], nbor[1])))

    }

    bombs.forEach(element => {
        let e_h = Math.floor(element / width)
        let e_w = element - e_h * width
        
        let spot = document.querySelector('[value="' + element + '"]')
        spot.innerHTML = 'X'
        board[e_h][e_w].value = -1
        
        let nbors = getNbors(e_h, e_w)
        nbors.forEach((nbor) => incSquareValue(nbor[0], nbor[1]))

    });
    
}

function changeVisability(h, w){
    makeVisable(h, w)

    if(board[h][w].value === 0){
        let nbors = getNbors(h, w)
        nbors.forEach((nbor) => {
            let n_h = nbor[0]
            let n_w = nbor[1]
            let square = board[n_h][n_w]
            if(square.value > 0  && !square.revealed){
                makeVisable(n_h, n_w)
            } else if(square.value === 0 && !square.revealed){
                changeVisability(n_h, n_w)
            }
        })    
    }

}

function makeVisable(h, w){
    let spot = document.querySelector('[value="' + (getLoc(h, w)) + '"]')
    spot.classList.remove("hidden")
    if(spot.classList.contains("flagged")){
        spot.classList.remove("flagged")
        numMinesLeft += 1
        document.querySelector("#minesText").innerHTML = "Mines: " + numMinesLeft
    }
    
    board[h][w].revealed = true
    numVisable += 1
}

function getLoc(h, w){
    return h * width + w
}

function incSquareValue(h, w){
    if(board[h][w].value !== -1){
        let spot = document.querySelector('[value="' + getLoc(h, w) + '"]')
        let val = parseInt(spot.innerHTML, 10) + 1
        spot.innerHTML = val
        board[h][w].value = val
    }
}

function getNbors(h, w){
    let nbors = []
    
    if(h === 0 && w === 0){
        nbors.push([h, w + 1])
        nbors.push([h + 1, w])
        nbors.push([h + 1, w + 1])
    } else if(h === 0 && w === (width - 1)){
        nbors.push([h, w - 1])
        nbors.push([h + 1, w])
        nbors.push([h + 1, w - 1])
    } else if(h === (height - 1) && w === 0){
        nbors.push([h - 1, w])
        nbors.push([h, w + 1])
        nbors.push([h - 1, w + 1])
    } else if(h === (height - 1) && w === (width - 1)){
        nbors.push([h - 1, w])
        nbors.push([h, w - 1])
        nbors.push([h - 1, w - 1])
    } else if(w === 0){
        nbors.push([h - 1, w])
        nbors.push([h - 1, w + 1])
        nbors.push([h, w + 1])
        nbors.push([h + 1, w + 1])
        nbors.push([h + 1, w])
    } else if(h === 0){
        nbors.push([h, w + 1])
        nbors.push([h + 1, w + 1])
        nbors.push([h + 1, w])
        nbors.push([h + 1, w - 1])
        nbors.push([h, w - 1])
    } else if(w === (width - 1)){
        nbors.push([h + 1, w])
        nbors.push([h + 1, w - 1])
        nbors.push([h, w - 1])
        nbors.push([h - 1, w - 1])
        nbors.push([h - 1, w])
    } else if(h === (height - 1)){
        nbors.push([h, w - 1])
        nbors.push([h - 1, w - 1])
        nbors.push([h - 1, w])
        nbors.push([h - 1, w + 1])
        nbors.push([h, w + 1])
    } else{
        nbors.push([h - 1, w])
        nbors.push([h - 1, w + 1])
        nbors.push([h, w + 1])
        nbors.push([h + 1, w + 1])
        nbors.push([h + 1, w])
        nbors.push([h + 1, w - 1])
        nbors.push([h, w - 1])
        nbors.push([h - 1, w - 1])
    }

    return nbors
}

function startGame(numMines){
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let spot = document.querySelector('[value="' + getLoc(i, j) + '"]')
            spot.innerHTML = 0
            spot.className = ""
            spot.classList.add("square")
            spot.classList.add("hidden")

            board[i][j].value = 0
            board[i][j].revealed = false
        }
    }
    numVisable = 0
    numMinesLeft = numMines
    document.querySelector("#minesText").innerHTML = "Mines: " + numMines
    document.querySelector("#topMsg").innerHTML = "Minesweeper!"
    gameOver = false
    document.querySelector("#settingsButton").style.opacity = "1"
}

function changeSettings(){
    if(numVisable === 0){
        if(settingsHidden)
            document.querySelector("#settingsComponent").style.display = "block"
        else
            document.querySelector("#settingsComponent").style.display = "none"
        settingsHidden = !settingsHidden  
    }
    
}

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
    if(gameOver)
            return
    if(e.target.classList.contains("square") && e.target.classList.contains("hidden")){
        if(!e.target.classList.contains("flagged")){
            if(numMinesLeft !== 0){
                e.target.classList.add("flagged")
                numMinesLeft -= 1
                document.querySelector("#minesText").innerHTML = "Mines: " + numMinesLeft    
            }
        } else{
            e.target.classList.remove("flagged")
            numMinesLeft += 1
            document.querySelector("#minesText").innerHTML = "Mines: " + numMinesLeft
        }
    }
    
        

})

export default Game;