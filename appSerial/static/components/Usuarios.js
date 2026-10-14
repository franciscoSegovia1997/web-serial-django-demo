function Usuarios()
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
        usuariosSistema:[],
        nombreUsuario:'',
        apellidoUsuario:'',
        edadUsuario:'',
        profesionUsuario:'',
        actualizarComponente:'',
    })

    React.useEffect(()=>{
        fetch('/consultarUsuarios')
        .then(response => response.json())
        .then(data => {
            const listaUsuariosSistema = data.usuariosSistema.map(usuarioInfo => ({
                id:usuarioInfo.id,
                data:{
                    nombreUsuario:{
                        id:usuarioInfo.id,
                        data:usuarioInfo.nombreUsuario,
                    },
                    apellidoUsuario:{
                        id:usuarioInfo.id,
                        data:usuarioInfo.apellidoUsuario,
                    },
                    edadUsuario:{
                        id:usuarioInfo.id,
                        data:usuarioInfo.edadUsuario,
                    },
                    profesionUsuario:{
                        id:usuarioInfo.id,
                        data:usuarioInfo.profesionUsuario,
                    }
                }
            }));

            setState((prevState) => ({
                ...prevState,
                usuariosSistema: listaUsuariosSistema,
            }));
        })
        .catch(error => {
            console.error('Error al cargar los usuarios',error)
        })
    },[state.actualizarComponente])

    const fieldsModel = [
        {id:1, nombre:'Nombre'},
        {id:2, nombre:'Apellido'},
        {id:3, nombre:'Edad'},
        {id:4, nombre:'Profesion'},
    ]

    const cambiarNombreUsuario = (event) => {
        const nuevoNombre = event.target.value;
        setState((prevState) => ({
            ...prevState,
            nombreUsuario:nuevoNombre,
        }));
    }

    const cambiarApellidoUsuario = (event) => {
        const nuevoApellido = event.target.value;
        setState((prevState) => ({
            ...prevState,
            apellidoUsuario:nuevoApellido,
        }));
    }

    const cambiarEdadUsuario = (event) => {
        const nuevoEdad = event.target.value;
        setState((prevState) => ({
            ...prevState,
            edadUsuario:nuevoEdad,
        }));
    }

    const cambiarProfesionUsuario = (event) => {
        const nuevoProfesion = event.target.value;
        setState((prevState) => ({
            ...prevState,
            profesionUsuario:nuevoProfesion,
        }));
    }

    const crearUsuario = () => {
        const usuarioData = {
            nombreUsuario: state.nombreUsuario,
            apellidoUsuario: state.apellidoUsuario,
            edadUsuario: state.edadUsuario,
            profesionUsuario: state.profesionUsuario
        }
        fetch('/crearUsuario',{
            method:"POST",
            headers:{
                "X-Requested-With":"XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body:JSON.stringify(usuarioData)
        })
        .then(response => response.json())
        .then(data => {
            setState((prevState) => ({
                ...prevState,
                nombreUsuario:'',
                apellidoUsuario:'',
                edadUsuario:'',
                profesionUsuario:'',
                actualizarComponente:'1',
            }));
        })
        .catch(error => {
            console.error("Error al crear usuario", error)
        });
    }

    return(
        <div>
            <h1>Seccion de usuarios</h1>
            <br />
            <div className="row mx-0">
                <div className="col-2">
                    <div className="row mx-0">
                        <a className="btn btn-success text-white" data-bs-toggle="modal" data-bs-target="#nuevoProducto">
                            Nuevo <i className="fa-solid fa-store"></i>
                        </a>
                    </div>
                </div>
            </div>
            <br />
            <TablaUsuarios
                columnas={fieldsModel}
                infoTable={state.usuariosSistema}
            />
            <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" id="nuevoProducto">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nuevo Producto</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3 mt-3">
                                <div className="col-6">
                                    <label>Nombre</label>
                                    <input type="text" className="form-control" value={state.nombreUsuario} onChange={cambiarNombreUsuario}/>
                                </div>
                                <div className="col-6">
                                    <label>Apellido</label>
                                    <input type="text" className="form-control" value={state.apellidoUsuario} onChange={cambiarApellidoUsuario}/>
                                </div>
                            </div>
                            <div className="row mb-3 mt-3">
                                <div className="col-6">
                                    <label>Edad</label>
                                    <input type="text" className="form-control" value={state.edadUsuario} onChange={cambiarEdadUsuario}/>
                                </div>
                                <div className="col-6">
                                    <label>Profesion</label>
                                    <input type="text" className="form-control" value={state.profesionUsuario} onChange={cambiarProfesionUsuario}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={crearUsuario}>Crear</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}