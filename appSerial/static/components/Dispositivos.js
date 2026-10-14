function Dispositivos()
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
        dispositivosSistema:[],
        nombreDispositivo:'',
        codigoDispositivo:'',
        fabricanteDispositivo:'',
        actualizarComponente:'',
    })

    React.useEffect(()=>{
        fetch('/consultarDispositivos')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const listaDispositivosSistema = data.dispositivosSistema.map(dispositivoInfo => ({
                id:dispositivoInfo.id,
                data:{
                    nombreDispositivo:{
                        id:dispositivoInfo.id,
                        data:dispositivoInfo.nombreDispositivo,
                    },
                    codigoDispositivo:{
                        id:dispositivoInfo.id,
                        data:dispositivoInfo.codigoDispositivo,
                    },
                    fabricanteDispositivo:{
                        id:dispositivoInfo.id,
                        data:dispositivoInfo.fabricanteDispositivo,
                    },
                }
            }));

            setState((prevState) => ({
                ...prevState,
                dispositivosSistema: listaDispositivosSistema,
            }));
        })
        .catch(error => {
            console.error('Error al cargar los usuarios',error)
        })
    },[state.actualizarComponente])

    const columnasTabla = [
        {id:1, nombre:'Nombre'},
        {id:2, nombre:'Codigo'},
        {id:3, nombre:'Fabricante'}
    ]

    const cambiarNombreDispositivo = (event) => {
        const nuevoNombre = event.target.value;
        setState((prevState) => ({
            ...prevState,
            nombreDispositivo:nuevoNombre,
        }));
    }

    const cambiarCodigoDispositivo = (event) => {
        const nuevoCodigo = event.target.value;
        setState((prevState) => ({
            ...prevState,
            codigoDispositivo:nuevoCodigo,
        }));
    }

    const cambiarFabricanteDispositivo = (event) => {
        const nuevoFabricante = event.target.value;
        setState((prevState) => ({
            ...prevState,
            fabricanteDispositivo:nuevoFabricante,
        }));
    }

    const crearDispositivo = () => {

        const dispositivoData = {
            nombreDispositivo: state.nombreDispositivo,
            codigoDispositivo: state.codigoDispositivo,
            fabricanteDispositivo: state.fabricanteDispositivo
        }
        fetch('/crearDispositivo',{
            method:"POST",
            headers:{
                "X-Requested-With":"XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body:JSON.stringify(dispositivoData)
        })
        .then(response => response.json())
        .then(data => {
            setState((prevState) => ({
                ...prevState,
                nombreDispositivo:'',
                codigoDispositivo:'',
                fabricanteDispositivo:'',
                actualizarComponente:'1',
            }));
        })
        .catch(error => {
            console.error("Error al crear usuario", error)
        });
    }

    return(
        <div>
            <h1>Seccion de dispositivos</h1>
            <br />
            <div className="row mx-0">
                <div className="col-2">
                    <div className="row mx-0">
                        <a className="btn btn-success text-white" data-bs-toggle="modal" data-bs-target="#nuevoDispositivo">
                            Nuevo <i className="fa-solid fa-store"></i>
                        </a>
                    </div>
                </div>
            </div>
            <br />
            <TablaDispositivos
                columnas={columnasTabla}
                infoTable={state.dispositivosSistema}
            />
            <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" id="nuevoDispositivo">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nuevo Dispositivo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3 mt-3">
                                <div className="col-6">
                                    <label>Nombre</label>
                                    <input type="text" className="form-control" value={state.nombreDispositivo} onChange={cambiarNombreDispositivo}/>
                                </div>
                                <div className="col-6">
                                    <label>Codigo</label>
                                    <input type="text" className="form-control" value={state.codigoDispositivo} onChange={cambiarCodigoDispositivo}/>
                                </div>
                            </div>
                            <div className="row mb-3 mt-3">
                                <div className="col-6">
                                    <label>Fabricante</label>
                                    <input type="text" className="form-control" value={state.fabricanteDispositivo} onChange={cambiarFabricanteDispositivo}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={crearDispositivo}>Crear</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}