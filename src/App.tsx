import { useEffect, useRef, useState } from "react"
import { Square, SquareType } from "./components/square"
import { Constants } from "./environment/constants"
import { Field } from "./components/field"
import { Row } from "./components/row"
import { switchElement } from "./utils/switchElement"
import './styles/app.sass'

function App() {
  const [fieldMatrix , setFieldMatrix] = useState<SquareType[][]>(Array(Constants.FIELD_HEIGHT).fill(null).map( () =>
    Array(Constants.FIELD_WIDTH).fill(SquareType.Type0)
  ));

  const currentPiece = useRef({
    type: 0,
    orientation: 0,
    position: {row:1, column:4},
    
  }); 

  useEffect(() =>{
    makePieceAt(5,0)
  },[]);
  
  function makePieceAt(row: number, column: number){
    switchSquareTo(SquareType.Type1, row, column);
    switchSquareTo(SquareType.Type1, row, column+1);
    switchSquareTo(SquareType.Type1, row, column+2);
    switchSquareTo(SquareType.Type1, row+1, column+2);
  }

  function switchSquareTo(type: SquareType, row: number, column: number) {
    setFieldMatrix((prev) =>  switchElement(prev, row, column, type) );
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
