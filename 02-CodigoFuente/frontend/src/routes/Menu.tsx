import HeaderAdmin from '../components/HeaderAdmin';
import InicializarMenu from '../components/InicializarMenu';

function Menu() {
  return (
    <>
    <HeaderAdmin />
      <main>

       <h1 className="text-3xl font-bold mb-6">Inicialización de Jornada</h1>

        {/* Aquí se renderiza el componente de reportes */}
        <InicializarMenu />

      </main>
    </>
  );
}

export default Menu;