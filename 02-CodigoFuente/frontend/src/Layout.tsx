import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <main>
            <nav>
                <Link to="/">Home feo</Link> |{" "}
                <Link to="/admin">Admin</Link> |{" "}
                <Link to="/menu">Menu</Link> |{" "}
                <Link to="/reportes">Reportes</Link>
            </nav>
            <section>
                <Outlet />
            </section>
        </main>
    );
}