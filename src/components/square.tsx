import '../styles/square.sass'

export enum SquareType {
    Empty = 'type0',
    CurrentPiece = 'type1',
    StackedPiece = 'type2',
    Type3 = 'type3'
}

type SquareProps = {
    type: SquareType;
}

export function Square(props: SquareProps){


    return(
        <div className = {'square ' + props.type }>
            
        </div>
    )
}