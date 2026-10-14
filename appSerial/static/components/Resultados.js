function Resultados()
{
    function getCookie(name)
    {
        let cookieValue = null;
        if(document.cookie && document.cookie !== "")
        {
            const cookies = document.cookie.split(';');
            for(let i = 0; i < cookies.length; i++)
            {
                const cookie = cookies[i].trim();
                if(cookie.substring(0,name.length + 1) === (name + "="))
                {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue 
    }

    const [state,setState] = React.useState({
        actualizarComponente:'',
        dispositivoSerial:null,
        datosDispositivo:[],
        puertoConectado:false,
        registrosSistema:[],
        arregloValores:[],
    })

    const fieldsModel = [
        {id:1, nombre:'Codigo'},
        {id:2, nombre:'Ver'},
    ]

    React.useEffect(()=>{
        fetch('/consultarRegistros')
        .then(response => response.json())
        .then(data => {
            const listaRegistrosSistema = data.registrosSistema.map(registroInfo => ({
                id:registroInfo.id,
                data:{
                    codigoRegistro:{
                        id:registroInfo.id,
                        data:registroInfo.codigoRegistro,
                    }
                }
            }));

            setState((prevState) => ({
                ...prevState,
                registrosSistema: listaRegistrosSistema,
            }));
        })
        .catch(error => {
            console.error('Error al cargar los registros',error)
        })
    },[state.actualizarComponente])

    var dispositivoSerial;
    var puertoSerial;

    const conectarDispositivo = async () =>
    {
        if('serial' in navigator)
        {
            puertoSerial = navigator.serial
            try
            {
                dispositivoSerial = await puertoSerial.requestPort();
                await dispositivoSerial.open({ baudRate: 9600, bufferSize: 12288 });
                setState((prevState) => ({
                    ...prevState,
                    dispositivoSerial:dispositivoSerial,
                    puertoConectado:true
                }));
            }
            catch(e)
            {
                setState((prevState) => ({
                    ...prevState,
                    puertoConectado:false,
                }));
            }
        }
        else
        {
            alert("No se tiene el modulo serial en este navegador")
        }
    }

    const leerDispositivo = async (event) =>
    {
        if(state.puertoConectado)
        {
            let writer = state.dispositivoSerial.writable.getWriter();
            let data = new Uint8Array([0x41]);
            await writer.write(data);
            writer.releaseLock();
            setTimeout(async ()=>{
                let reader = state.dispositivoSerial.readable.getReader();
                const { value, done } = await reader.read();
                if(value)
                {
                    setState((prevState) => ({
                        ...prevState,
                        datosDispositivo:Array.from(value),
                    }));
                    reader.releaseLock();
                }
            },1500)
        }
        else
        {
            alert("Primero conecte el dispositivo")
        }
    }

    const guardarResultados = () => {
        const datosDispositivo = state.datosDispositivo
        fetch('/crearRegistro',{
            method:"POST",
            headers:{
                "X-Requested-With":"XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body:JSON.stringify(datosDispositivo)
        })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => {
            console.error("Error al enviar registro", error)
        });

        state.dispositivoSerial.close()

        setState((prevState) => ({
            ...prevState,
            dispositivoSerial:null,
            datosDispositivo:[],
            puertoConectado:false,
            actualizarComponente:'1',
        }));
    }

    const conseguirDatos = (idRegistro) =>
    {
        fetch(`/conseguirDatos/${idRegistro}`)
        .then(response => response.json())
        .then(data => {
            const listaArregloValores = data.arregloValores

            setState((prevState) => ({
                ...prevState,
                arregloValores: listaArregloValores,
            }));
        })
        .catch(error => {
            console.error('Error al cargar la info',error)
        })
    }

    return(
        <div>
            <h1>Resultados y reportes</h1>
            <br />
            <div className="row mx-0">
                <div className="col-2">
                    <div className="row mx-0">
                        <a className="btn btn-success text-white" data-bs-toggle="modal" data-bs-target="#obtenerDatos">
                            Nuevo <i className="fa-solid fa-store"></i>
                        </a>
                    </div>
                </div>
            </div>
            <br />
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {
                                fieldsModel.map((columna)=>(
                                    <th className="text-center" key={columna.id}>{columna.nombre}</th>
                                ))                        
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            state.registrosSistema.map((register)=>(
                                <tr key={register.id}>
                                    <td className="text-center">{register.data.codigoRegistro.data}</td>
                                    <td className="text-center"><button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#mostrarDatos" onClick={() => conseguirDatos(register.id)}>Ver <i className="fa-solid fa-eye"></i></button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" id="obtenerDatos">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Obtener datos</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3 mt-3 justify-content-center">
                                <div className="col-5">
                                    <div className="row mx-2">
                                        <button className="btn btn-success" onClick={conectarDispositivo}>Conectar</button>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="row mx-2">
                                        <button className="btn btn-primary" onClick={leerDispositivo}>Leer</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3 mt-3 justify-content-center">
                                <div className="col-10">
                                    <div className="row">
                                        <input className="form-control" type="text" value={state.datosDispositivo} readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={guardarResultados}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" id="mostrarDatos">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Datos del registro</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3 mt-3 justify-content-center">
                                <div className="col-10">
                                    <div className="row">
                                        <input className="form-control" type="text" value={state.arregloValores} readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}