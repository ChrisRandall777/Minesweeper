function Settings({ setNumMines, setStateHeight, setStateWidth }){
    
    return (
        <div id="settingsContainer">
            <form>
                <label>Mines</label><br></br>
                <input type="text" id="fmines" name="fmines" placeholder="10" onChange={(e) => update(e, "fmines", setNumMines, setNumMines)}></input><br></br>
                <label>Height</label><br></br>
                <input type="text" id="fheight" name="fheight" placeholder="10" onChange={(e) => update(e, "fheight", setStateHeight, setNumMines)}></input><br></br>
                <label>Width</label><br></br>
                <input type="text" id="fwidth" name="fwidth" placeholder="10" onChange={(e) => update(e, "fwidth", setStateWidth, setNumMines)}></input>
            </form>
            
        </div>
    )
}

function update(e, id, updateFunction, setNumMines){
    let input = e.target.value
    let ele = document.getElementById(id)
    if(input === "")
        input = "10"
    
    let val = parseInt(input, 10)
    if(!isNaN(val)){
        let currHeight = document.getElementById("fheight").value
        currHeight = currHeight === "" ? 10 : parseInt(currHeight, 10)
        let currWidth = document.getElementById("fwidth").value
        currWidth = currWidth === "" ? 10 : parseInt(currWidth, 10)
        let boardArea = currHeight * currWidth

        if(id === "fmines" && val > boardArea - 10)
            ele.style.backgroundColor = "red"
        else if(id !== "fmines" && (val > 15 || val < 5))
            ele.style.backgroundColor = "red"
        else {
            updateFunction(val)
            ele.style.backgroundColor = "white"
            if(id !== "fmines"){
                console.log("run")
                if(id === "fheight")
                    boardArea = currWidth * val
                else
                    boardArea = currHeight * val
                console.log(boardArea)

                let numMines = document.getElementById("fmines").value
                numMines = numMines === "" ? 10 : parseInt(numMines, 10)
                
                if(numMines > boardArea - 10){
                    let newNumMines = boardArea - 10 - (boardArea % 5)
                    setNumMines(newNumMines)
                    document.getElementById("fmines").value = newNumMines
                }
                    
            }
        }
    } else
        ele.style.backgroundColor = "red"
    
}

export default Settings;