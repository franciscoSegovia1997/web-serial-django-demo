function App()
{
    const [selectedComponent, setSelectedComponent] = React.useState('Usuarios');

    const navbarBrandStyle = {
        marginLeft: '10px',
    };

    const logoutButton = {
        marginRight: '10px',
    }

    const handleButtonClick = (component) => {
        setSelectedComponent(component);
    };

    return(
        <div>
            <nav className="navbar navbar-dark bg-secondary justify-content-between">
                <span className="navbar-brand" style={navbarBrandStyle}>
                    <i className="fa-solid fa-hospital-user fa-2x"></i>
                </span>
                <div>
                    <button className="btn btn-light me-2" onClick={() => handleButtonClick('Usuarios')}>
                        <i className="fa-solid fa-home text-primary fa-2x"></i>
                    </button>
                    <button className="btn btn-light me-2" onClick={() => handleButtonClick('Dispositivos')}>
                        <i className="fa-solid fa-play text-primary fa-2x"></i>
                    </button>
                    <button className="btn btn-light me-2" onClick={() => handleButtonClick('Resultados')}>
                        <i className="fa-solid fa-store text-primary fa-2x"></i>
                    </button>
                </div>
                <div style={logoutButton}>
                    <button className="btn btn-light me-2">
                        <i className="fa-solid fa-right-from-bracket text-primary fa-2x"></i>
                    </button>
                </div>
            </nav>
            <div className="container mt-5">
                {selectedComponent === 'Usuarios' && <Usuarios />}
                {selectedComponent === 'Dispositivos' && <Dispositivos />}
                {selectedComponent === 'Resultados' && <Resultados />}
            </div>
        </div>
    );
}