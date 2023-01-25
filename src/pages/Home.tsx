import { useEffect, useRef, useState } from "react"
import { Square } from "../components/square"
import { Constants } from "../environment/constants"
import { Field } from "../components/field"
import { Row } from "../components/row"
import { switchElement } from "../utils/switchElement"
import { Direction, SquareType, PieceType } from "../utils/Types"
import '../styles/home.sass'


function App() {
    const [fieldMatrix, setFieldMatrix] = useState<SquareType[][]>(Array(Constants.FIELD_HEIGHT).fill(null).map(() =>
        Array(Constants.FIELD_WIDTH).fill(SquareType.Empty)
    ));

    var currentMatrix = fieldMatrix;

    const currentPiece = useRef({
        type: 0,
        orientation: 0,
        position: { row: 0, column: 0 },
        parts: [{row:0, column:0}],
    });

    const interval = useRef(0);

    useEffect(() => {
        
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case ' ':
                    makeNewPieceFall();
                    break;
                case 'ArrowRight':
                    handlePieceMovement(Direction.Right);
                    break;
                case 'ArrowLeft':
                    handlePieceMovement(Direction.Left);
                    break;
                case 'ArrowUp':
                    handleRotatePiece();
                    break;
            }
        });

    }, []);

    function switchSquareTo(type: SquareType, row: number, column: number) {
        currentMatrix = switchElement(currentMatrix, row, column, type);
        setFieldMatrix(currentMatrix);
    }

    function drawPiece(pieceParts: Array<{row: number, column: number}>, pieceType: PieceType){ //only draw on the field
        let squareType: SquareType;
        switch (pieceType) {
            case PieceType.L:
                squareType = SquareType.PieceL
                break;
            case PieceType.I:
                squareType = SquareType.PieceI
                break;
            case PieceType.T:
                squareType = SquareType.PieceT
                break;
            case PieceType.J:
                squareType = SquareType.PieceJ
                break;
            case PieceType.O:
                squareType = SquareType.PieceO
                break;
            case PieceType.S:
                squareType = SquareType.PieceS
                break;
            case PieceType.Z:
                squareType = SquareType.PieceZ
                break;

        }
        pieceParts.forEach(part => {
            switchSquareTo(squareType, part.row, part.column);
        });
    }

    function erasePiece(pieceParts: Array<{row: number, column: number}>){ //only erase from field
        pieceParts.forEach(part => {
            switchSquareTo(SquareType.Empty, part.row, part.column);
        });
    }

    function handleRotatePiece(){
        let shouldRotate = true;
        getNewPartsPositions().forEach(part => {
            if(part.row < 0 || part.column < 0 || part.row >= Constants.FIELD_HEIGHT || part.column >= Constants.FIELD_WIDTH){
                shouldRotate = false;
            } else if(currentMatrix[part.row][part.column] == SquareType.StackedPiece) shouldRotate = false;
        });
        if(shouldRotate){
            erasePiece(currentPiece.current.parts);
            currentPiece.current.parts = getNewPartsPositions();   
            drawPiece(currentPiece.current.parts, currentPiece.current.type);
        }
        function getNewPartsPositions(){
            let newPartsPositions : {row:number,column:number}[] = [];
            currentPiece.current.parts.forEach( part => {
                let newDistanceToRotationAxisX = currentPiece.current.position.row - part.row;
                let newDistanceToRotationAxisY = part.column - currentPiece.current.position.column;
                newPartsPositions.push({
                    row: currentPiece.current.position.row + newDistanceToRotationAxisY,
                    column: currentPiece.current.position.column + newDistanceToRotationAxisX
                });
            }); 
            return newPartsPositions;
        }
    }



    function makePieceAt(type: PieceType, row: number, column: number) {
        currentPiece.current.type = type;
        currentPiece.current.position.row = row;
        currentPiece.current.position.column = column;
        switch (type) {
            case PieceType.J:
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column + 1}, 
                    {row: row, column: column - 1}, 
                    {row: row + 1, column: column + 1}
                ];
                drawPiece(currentPiece.current.parts, currentPiece.current.type);
                break;
        
            case PieceType.T:
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column + 1}, 
                    {row: row, column: column - 1}, 
                    {row: row + 1, column: column}
                ];
                drawPiece(currentPiece.current.parts, currentPiece.current.type);
                break;

            case PieceType.L:
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column + 1}, 
                    {row: row, column: column - 1}, 
                    {row: row + 1, column: column - 1}
                ];
                drawPiece(currentPiece.current.parts, currentPiece.current.type);
                break;
            case PieceType.I:
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column + 1}, 
                    {row: row, column: column + 2}, 
                    {row: row, column: column - 1}
                ];
                drawPiece(currentPiece.current.parts, currentPiece.current.type);
                break;
            case PieceType.O:
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column + 1}, 
                    {row: row +1 , column: column}, 
                    {row: row +1, column: column + 1}
                ];
                drawPiece(currentPiece.current.parts, currentPiece.current.type);
                break;
            case PieceType.S:
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column + 1}, 
                    {row: row +1 , column: column}, 
                    {row: row +1, column: column - 1}
                ];
                drawPiece(currentPiece.current.parts, currentPiece.current.type);
                break;
            case PieceType.Z:
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column - 1}, 
                    {row: row +1 , column: column}, 
                    {row: row +1, column: column + 1}
                ];
                drawPiece(currentPiece.current.parts, currentPiece.current.type);
                break;
        }

    }
    function shouldPieceStop():boolean{
        let result = false;
        for (let i = 0; i < currentPiece.current.parts.length; i++) {
            if(currentPiece.current.parts[i].row == Constants.FIELD_HEIGHT - 1){ //if piece hits bottom
                result = true;
                break;
            }
            if(currentMatrix[currentPiece.current.parts[i].row + 1][currentPiece.current.parts[i].column] == SquareType.StackedPiece){ //if hits another stacked piece
                result = true;
                break;
            }

        }

        return result;
    }

    function stopCurrentPiece(){
        clearInterval(interval.current);
        currentPiece.current.parts.forEach( part => {
            switchSquareTo(SquareType.StackedPiece, part.row, part.column);
        });
        handleCompleteRow().then(makeNewPieceFall);
        
    }

    function handleCompleteRow(){
        return new Promise<void>(resolve=> {
            let rowCount = 0;
            for (let row = 0; row < currentMatrix.length; row++) {
                if(currentMatrix[row][0] == SquareType.StackedPiece){
                    for(let j = 0; j < currentMatrix[row].length; j++){
                        if(currentMatrix[row][j] == SquareType.StackedPiece){
                            rowCount++;
                        }else{
                            rowCount=0;
                            break;
                        }
                    }
                    
                }
                if(rowCount == Constants.FIELD_WIDTH){ //if row is complete
                    console.log(row);
                    eraseRow(row);
                    setTimeout(() => {
                        knockOverStack(row);
                        setTimeout(() => {
                            resolve();
                        }, Constants.GAME_INTERVAL);
                    }, Constants.GAME_INTERVAL);
                }else{
                    resolve();
                }
                rowCount=0;
            }

        });
    }

    function movePiece(direction: Direction){
        erasePiece(currentPiece.current.parts);
        switch (direction) {
            case Direction.Down:
                currentPiece.current.position.row++;
                currentPiece.current.parts.forEach(part => {
                    part.row++;
                });
                break;
            case Direction.Left:
                currentPiece.current.position.column--;
                currentPiece.current.parts.forEach(part => {
                    part.column--;
                });
                break;
            case Direction.Right:
                currentPiece.current.position.column++;
                currentPiece.current.parts.forEach(part => {
                    part.column++;
                });
                break;
        }
        drawPiece(currentPiece.current.parts, currentPiece.current.type);
    }

    function eraseRow(row: number){
        currentMatrix[row].forEach((_value, column) => {
            switchSquareTo(SquareType.Empty, row, column);
        })
    }

    function knockOverStack(row: number){
        if(row == 0){
            currentMatrix[row].forEach((value, column) => {
                switchSquareTo(SquareType.Empty, row, column);
            })
        }else{
            currentMatrix[row].forEach((value, column) => {
                switchSquareTo(currentMatrix[row - 1][column], row, column);
            })
            knockOverStack(row - 1);
        }
    }

    function theGameIsOver(){
        let result = false;
        currentPiece.current.parts.forEach(part => {
            if(currentMatrix[part.row + 1][part.column] == SquareType.StackedPiece){ //if hits another stacked piece
                result = true;
            }
        });
        return result;
    }

    function makeNewPieceFall(){
        

        let piece = Math.floor(Math.random() * 7);
        makePieceAt(piece, 0, 5);
        clearInterval(interval.current);
        if(theGameIsOver()){
            alert("Game Over!")
        }else interval.current = setInterval(() => {
            if(shouldPieceStop()){
                stopCurrentPiece();
            }else{
                handlePieceMovement(Direction.Down);
            }
        }, Constants.GAME_INTERVAL);
    }


    function handlePieceMovement(direction: Direction){
        let shouldMove = true;
        switch (direction) {
            case Direction.Down:
                currentPiece.current.parts.forEach(part => {
                    if(part.row == Constants.FIELD_HEIGHT - 1) shouldMove = false;
                });
                break;
            case Direction.Left:
                currentPiece.current.parts.forEach(part => {
                    if(part.column == 0) shouldMove = false; //should not move if at the begining of the field
                    if(currentMatrix[part.row][part.column-1] == SquareType.StackedPiece) shouldMove = false; //should not move left if there are pieces stacked at left
                });
                break;
            case Direction.Right:
                currentPiece.current.parts.forEach(part => {
                    if(part.column == Constants.FIELD_WIDTH - 1) shouldMove = false; //should not move if at the end of the field
                    if(currentMatrix[part.row][part.column+1] == SquareType.StackedPiece) shouldMove = false; //should not move right if there are pieces stacked at right
                });
                break;
        }
        if (shouldMove) movePiece(direction);
    }



    return (
        <div className="App">
            <Field>
                {
                    fieldMatrix.map((squareTypeArray, row) => (
                        <Row key={row}>
                            {
                                squareTypeArray.map((value, column) => (
                                    <Square key={column} type={value} />
                                ))
                            }
                        </Row>
                    ))
                }
            </ Field>
        </div>
    )
}

export default App



