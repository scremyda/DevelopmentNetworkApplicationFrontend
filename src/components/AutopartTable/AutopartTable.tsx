import AutopartTableCell from './AutopartTableCell.tsx';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {FC, useEffect} from "react";
import {fetchAutoparts} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import './AutopartTable.css'

interface AutopartTableProps {
    setPage: () => void
}

const AutopartTable: FC<AutopartTableProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {autoparts, isLoading, error, success} = useAppSelector(state => state.autopartReducer)
    useEffect(() => {
        setPage()
        dispatch(fetchAutoparts())
    }, []);

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Nav className="ms-2">
                <Nav.Item>
                    <Link to="/add-autopart-2" className="btn btn-outline-primary mt-2"
                          style={{marginLeft: '80px', marginBottom: '30px'}}>
                        Добавить автозапчасть
                    </Link>
                </Nav.Item>
            </Nav>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название автозапчасти</th>
                    <th>Статус</th>
                    <th>Описание</th>
                    <th>Изображение</th>
                </tr>
                </thead>
                <tbody>
                {autoparts.map(autopart => (
                    <AutopartTableCell autopartData={autopart}/>
                ))
                }
                </tbody>
            </table>
        </>
    );
};

export default AutopartTable;
