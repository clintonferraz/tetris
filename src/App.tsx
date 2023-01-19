import { useEffect, useRef, useState } from "react"
import { Square, SquareType } from "./components/square"
import { Constants } from "./environment/constants"
import { Field } from "./components/field"
import { Row } from "./components/row"
import { switchElement } from "./utils/switchElement"
import './styles/app.sass'

enum PieceType {
    L,
    T,
    I,
    J
}

enum Direction {
    Up,
    Right,
    Down,
    Left
}

function App() {
    const [fieldMatrix, setFieldMatrix] = useState<SquareType[][]>(Array(Constants.FIELD_HEIGHT).fill(null).map(() =>
        Array(Constants.FIELD_WIDTH).fill(SquareType.Empty)
    ));

    var currentMatrix = fieldMatrix;

    const currentPiece = useRef({
        type: 0,
        orientation: 0,
        position: { row: 0, column: 0 },
        parts: [{row:0, column:0}]
    });

    const interval = useRef(0);

    useEffect(() => {
        
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case ' ':
                    start();
                    break;
                case 'ArrowRight':
                    handlePieceMovement(Direction.Right);
                    break;
                case 'ArrowLeft':
                    handlePieceMovement(Direction.Left);
                    break;
        }
        });
    }, []);

    function drawPiece(pieceParts: Array<{row: number, column: number}>){ //only draw on the field
        pieceParts.forEach(part => {
            switchSquareTo(SquareType.CurrentPiece, part.row, part.column);
        });
    }

    function erasePiece(pieceParts: Array<{row: number, column: number}>){ //only erase from field
        pieceParts.forEach(part => {
            switchSquareTo(SquareType.Empty, part.row, part.column);
        });
    }


    function makePieceAt(type: PieceType, row: number, column: number) {
        switch (type) {
            case PieceType.J:
                currentPiece.current.position.row = row;
                currentPiece.current.position.row = column;
                currentPiece.current.parts = [
                    {row: row, column: column}, 
                    {row: row, column: column + 1}, 
                    {row: row, column: column + 2}, 
                    {row: row + 1, column: column + 2}
                ];
                drawPiece(currentPiece.current.parts);
                break;
        
            default:
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
            if(currentMatrix[currentPiece.current.parts[i].row + 1][currentPiece.current.parts[i].column] == SquareType.StackedPiece){
                console.log('22222');
                result = true;
                break;
            }

        }

        return result;
    }

    function stopCurrentPiece(){
        //clearInterval(interval.current);
        currentPiece.current.parts.forEach( part => {
            switchSquareTo(SquareType.StackedPiece, part.row, part.column);
        })
        updateCurrentMatrix();
        checkForCompleteRow();
        makePieceAt(PieceType.J,0,0);
    }

    function checkForCompleteRow(){
        let isComplete = false;
        for (let i = 0; i < currentMatrix.length; i++) {
            if(currentMatrix[i][0] == SquareType.StackedPiece){
                console.log('piece stacked at first position');
                isComplete = true;
                for(let j = 0; j < currentMatrix[i].length; j++){
                    if(currentMatrix[i][j] != SquareType.StackedPiece){
                        isComplete = false
                        console.log('B');
                    }
                }
                if(isComplete){
                    currentMatrix[i].forEach((_, index) => {
                        switchSquareTo(SquareType.Empty, i, index);
                    })
                    
                    console.log('a');
                }
            }
        }

/*         currentMatrix.forEach(row => {
            if(row[0] == SquareType.StackedPiece){
                let isRowComplete = true;
                row.forEach(squareType =>{
                    if(squareType != SquareType.StackedPiece){
                        isRowComplete = false;
                    }
                })
                if(isRowComplete){
                    return true;
                }
            }
        }); */
    }

    function updateCurrentMatrix(){
        setFieldMatrix(prev => {
            currentMatrix = [... prev];
            return prev
        });
  
    }

    function start(){
        makePieceAt(PieceType.J ,0 ,0 );
        clearInterval(interval.current);
        interval.current = setInterval(() => {
            updateCurrentMatrix();
            if(shouldPieceStop()){
                stopCurrentPiece();
            }else{
                handlePieceMovement(Direction.Down);
            }
            
        }, 300);
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
        drawPiece(currentPiece.current.parts);
    }

    function switchSquareTo(type: SquareType, row: number, column: number) {
        setFieldMatrix((prev) => switchElement(prev, row, column, type));
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
            <button onClick={()=>console.log(fieldMatrix)}>teste</button>
        </div>
    )
}

export default App



