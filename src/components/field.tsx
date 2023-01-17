type FieldProps = {
    children: React.ReactNode;
}

export function Field(props: FieldProps){
    

    return(
        <div className='field'>
            {
                props.children
            }
        </div>
    );
    
}
