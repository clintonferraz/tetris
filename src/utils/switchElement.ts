import { SquareType } from "./Types";

export function switchElement(matrix: SquareType[][], x:number, y:number, type: SquareType){
    let newMatrix = [ ...matrix];
    newMatrix[x][y] = type;
    return newMatrix;
}