import { SquareType } from "../components/square";

export function switchElement(matrix: SquareType[][], x:number, y:number, type: SquareType){
    let newMatrix = matrix.map((row, index1) => (
        row.map((value, index2) => 
            (index1==x && index2==y) ? type : value
        )
    ));
    return newMatrix;
}