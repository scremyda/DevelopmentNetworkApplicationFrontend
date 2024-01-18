import {Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './Menu.css'
import {FC, useEffect} from "react";
import Cookies from "js-cookie";

interface MenuProps {
    setPage: () => void
}

const Menu: FC<MenuProps> = ({setPage}) => {
    const jwtToken = Cookies.get('jwtToken')
    const role = Cookies.get('role')

    useEffect(() => {
        setPage()
        //dispatch(fetchCurrentAssembly())
    }, []);

    if (!jwtToken) {
        return <>
            <Container className="text-center mt-5">
                <div className="menu rounded p-4">
                    <h2 className="mb-2">Меню</h2>
                    <div className="d-flex flex-column">
                        <Link to="/login" className="btn btn-outline-info my-2 rounded-pill">Войти</Link>
                        <Link to="/register"
                              className="btn btn-outline-info my-2 rounded-pill">Зарегестрироваться
                        </Link>
                    </div>
                </div>
            </Container>
        </>
    }

    return (
        <Container className="text-center mt-5">
            <div className="menu rounded p-4">
                <h2 className="mb-2">Меню</h2>
                <div className="d-flex flex-column">
                    <Link to="/autoparts" className="btn btn-outline-info my-2 rounded-pill">Автозапчасти</Link>
                    <Link to="/request" className="btn btn-outline-info my-2 rounded-pill">Список поставщиков</Link>
                    {role == '2' && <Link to="/add-autopart" className="btn btn-outline-info my-2 rounded-pill">Создать автозапчасть</Link>}
                    {role == '2' && <Link to="/autoparts/admin" className="btn btn-outline-info my-2 rounded-pill">Таблица автозапчастей</Link>}
                </div>
            </div>
        </Container>
    );
};

export default Menu;
