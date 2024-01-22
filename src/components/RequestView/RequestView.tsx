import React, {FC, useEffect, useState} from "react";
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchAssemblies, fetchAssembliesFilter, moderatorUpdateStatus} from "../../store/reducers/ActionCreator.ts";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import "./DatePickerStyle.css";
import "./RequestView.css";
import {Form, Button, Container, Row, Col} from "react-bootstrap";
import {format} from "date-fns";
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import {IAssembly} from "../../models/models.ts";
import debounce from 'lodash/debounce';
import ru from 'date-fns/locale/ru';
import {searchSlice} from "../../store/reducers/SearchSlice.ts";
interface RequestViewProps {
    setPage: () => void;
}

registerLocale('ru', ru);

// Устанавливаем русский язык по умолчанию
setDefaultLocale('ru');


const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {assembly, error, success} = useAppSelector((state) => state.assemblyReducer);
    const {isAuth} = useAppSelector((state) => state.userReducer);
    const {startDate, endDate,selectedStatus} = useAppSelector((state) => state.searchReducer);
    //const [startDate, setStartDate] = useState<Date | null>(null);
    //const [endDate, setEndDate] = useState<Date | null>(null);
    //const [selectedStatus, setSelectedStatus] = useState<string>('');
    const role = Cookies.get('role')
    const [filteredAssemblies, setFilteredAssemblies] = useState<IAssembly[] | null>(null);
    const [filteredByUsers, setFilteredUsers] = useState<IAssembly[] | null>(null);
    const [textValue, setTextValue] = useState<string>('');

    useEffect(() => {
        setPage();
        dispatch(fetchAssemblies());
        handleFilter()

        const debouncedHandleFilter = debounce(handleFilter, 1000); // Настройте время задержки по своему усмотрению


        const handleFilterInterval = setInterval(() => {
            debouncedHandleFilter();
        }, 5000);


        const cleanup = () => {
            clearInterval(handleFilterInterval);
        };

        window.addEventListener('beforeunload', cleanup);

        return () => {
            cleanup();
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [startDate, endDate, selectedStatus]);

    const resetFilter = () => {
        dispatch(searchSlice.actions.reset())
        handleFilter()
    }

    const handleFilter = () => {
        const formatDate = (date: Date | null | undefined): string | undefined => {
            if (!date) {
                return undefined;
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        if (role == '2') {
            dispatch(fetchAssembliesFilter(formattedStartDate, formattedEndDate, `${selectedStatus}`));
        } else {
            localFilter(formattedStartDate, formattedEndDate)
        }
    };

    function formatDate2(inputDate: string): string {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }

    const localFilter = (startDateString: string | undefined, endDateString: string | undefined) => {

        function isDateInRange(date: string): boolean {
            const bdDateString = formatDate2(date)
            const bdDate = new Date(bdDateString)
            const start = startDateString ? new Date(startDateString) : new Date('0001-01-01 00:00:01')
            const end = endDateString ? new Date(endDateString) : new Date('2033-12-21 23:59:00')
            return (!startDate || bdDate >= start) && (!endDate || bdDate <= end)
        }

        if (assembly) {
            const d = assembly.assembly.filter(obj => isDateInRange(obj.creation_date))
            setFilteredAssemblies(d)
        }
    }

    const clickCell = (cellID: number, event: React.MouseEvent<HTMLTableRowElement>) => {
        const isInsideButtons = event && (event.target as HTMLElement).closest('.my-3');        if (!isInsideButtons) {
            if (!isInsideButtons) {
                navigate(`/assemblies/${cellID}`);
            }
        }
    }

    if (!isAuth) {
        return (
            <Link to="/login" className="btn btn-outline-danger">
                Требуется войти в систему
            </Link>
        );
    }

    const handleInputChange = () => { //--------------------------------вот тут
        if (assembly) {
            const d = assembly.assemblies.filter(obj => obj.user_login === textValue)
            setFilteredUsers(d.length == 0 ? null : d)
        }
    };

    const handlerApprove = (id: number) => {
        dispatch(moderatorUpdateStatus(id, 'завершен'))
        //navigate(-1);
    }

    const handleDiscard = (id: number) => {
        dispatch(moderatorUpdateStatus(id, 'отклонен'))
        //navigate(-1);
    }

    return (
        <>
            {/* =================================== ALERTS ===========================================*/}

            {error !== "" && <MyComponent isError={true} message={error} />}
            {success !== "" && <MyComponent isError={false} message={success} />}

            {/* =================================== FILTERS ======================================*/}

            <Container>
                <Row className="justify-content-center">
                    <Col md={3} className="mb-3 custom-col">
                        {role === '2' &&
                            <Form.Group controlId="exampleForm.ControlInput1" className="custom-form">
                                <Form.Label className="text-start">Фильтрация по пользователю</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите текст"
                                    value={textValue}
                                    onChange={(e) => setTextValue(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleInputChange();
                                        }
                                    }}
                                />
                            </Form.Group>
                        }
                        <div className="filter-section d-flex flex-column">
                            <label>Дата создания с:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                    if (date) {
                                        dispatch(searchSlice.actions.setDateStart(date));
                                    }
                                }}
                                className="custom-datepicker"
                                popperPlacement="bottom-start"
                            />

                            <label>Дата окончания по:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                    if (date) {
                                        dispatch(searchSlice.actions.setDateEnd(date));
                                    }
                                }}
                                className="custom-datepicker"
                                popperPlacement="bottom-start"
                            />

                            {role === '2' &&
                                <>
                                    <label className="mb-2">Статус поставщика:</label>
                                    <Form.Select
                                        className='mb-2'
                                        value={selectedStatus || ""}
                                        onChange={(e) => dispatch(searchSlice.actions.setStatus(e.target.value))}
                                    >
                                        <option value="">Выберите статус</option>
                                        <option value="сформирован">Сформирован</option>
                                        <option value="завершен">Завершён</option>
                                        <option value="отклонен">Отклонён</option>
                                    </Form.Select>
                                </>
                            }

                            <Button style={{ width: '100%' }} variant="outline-dark"  onClick={handleFilter}>Применить фильтры</Button>
                            <Button variant="outline-dark" style={{ width: '100%' }} className='mt-2' onClick={resetFilter}>Сбросить фильтры</Button>
                        </div>
                    </Col>
                </Row>
            </Container>



            {/* =================================== TABLE ADMIN =============================================*/}
            {assembly &&
                <table className='table-assemblys'>
                    <thead>
                    <tr>
                        {/*<th>ID</th>*/}
                        <th>Название поставщика</th>
                        <th>Статус переговоров</th>
                        <th>Дата и время создания</th>
                        <th>Дата и время начала процесса</th>
                        <th>Дата и время принятия</th>
                        <th>Автор</th>
                        {role == '2' &&
                            <th>Модератор</th>
                        }
                        <th>Статус</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAssemblies && role == '0'
                        ? filteredAssemblies.map((assembly) => (
                            <tr key={assembly.id} onClick={(event) => clickCell(assembly.id, event)}>                                {/*<td>{assembly.id}</td>*/}
                                <td>{assembly.assembly_name || 'Не задано'}</td>
                                <td>{assembly.status_check || 'Не рассмотрен'}</td>
                                <td>{checkData(assembly.creation_date)}</td>
                                <td>{checkData(assembly.formation_date)}</td>
                                <td>{checkData(assembly.completion_date)}</td>
                                <td>{assembly.user_login || 'Не задан'}</td>
                                <td>{assembly.status}</td>
                            </tr>
                        ))
                        : (filteredByUsers ? filteredByUsers : assembly.assemblies).map((assembly) => (
                            <tr key={assembly.id} onClick={(event) => clickCell(assembly.id, event)}>
                                {/*<td>{assembly.id}</td>*/}
                                <td>{assembly.assembly_name || 'Не задано'}</td>
                                <td>{assembly.status_check || 'Не рассмотрен'}</td>
                                <td>{checkData(assembly.creation_date)}</td>
                                <td>{checkData(assembly.formation_date)}</td>
                                <td>{checkData(assembly.completion_date)}</td>
                                <td>{assembly.user_login || 'Не задан'}</td>
                                {role == '2' &&
                                    <td>{assembly.moderator_login || 'Не задан'}</td>
                                }
                                <td>{assembly.status}</td>
                                <td>
                                    {assembly.status == 'сформирован' && role == '2' && (

                                        <div className='my-3'
                                             style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                            <Button variant="outline-success" onClick={() => handlerApprove(assembly.id)}
                                                    className='mb-2'>
                                                Завершить
                                            </Button>

                                            <Button variant="outline-danger" onClick={() => handleDiscard(assembly.id)}
                                                    style={{width: '100%'}}>
                                                Отказать
                                            </Button>
                                        </div>

                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
};

export default RequestView;

function checkData(data: string): string {
    console.log(data);
    if (data === '0001-01-01T02:30:17+02:30') {
        return 'Дата не задана';
    }

    const formattedDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const formatted = formattedDate(data);
    return formatted;
}


