import '../styles/square.sass'

export enum SquareType {
    Type0 = 'type0',
    Type1 = 'type1',
    Type2 = 'type2',
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