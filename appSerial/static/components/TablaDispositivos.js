function TablaDispositivos(props)
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
                            <td>{register.data.nombreDispositivo.data}</td>
                            <td>{register.data.codigoDispositivo.data}</td>
                            <td>{register.data.fabricanteDispositivo.data}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}