import '../styles/square.sass'
import { SquareType } from '../utils/Types'

type SquareProps = {
    type: SquareType;
}

export function Square(props: SquareProps){


    return(
        <div className = {'square ' + props.type }>
            
        </div>
    )
}