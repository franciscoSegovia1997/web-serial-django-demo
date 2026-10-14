function TablaUsuarios(props)
{
    return(
        <table className="table table-striped">
            <thead>
                <tr>
                    {
                        props.columnas.map((columna)=>(
                            <th key={columna.id}>{columna.nombre}</th>
                        ))                        
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props.infoTable.map((register)=>(
                        <tr key={register.id}>
                            <td>{register.data.nombreUsuario.data}</td>
                            <td>{register.data.apellidoUsuario.data}</td>
                            <td>{register.data.edadUsuario.data}</td>
                            <td>{register.data.profesionUsuario.data}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}