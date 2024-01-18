import {FC, useEffect, useState} from 'react';
import {
    // convertServerDateToInputFormat,
    DateFormat,
    deleteAssembly,
    emptyString, fetchAssemblyById,
    makeAssembly,
    // moderatorUpdateStatus,
    updateAssembly
} from '../../store/reducers/ActionCreator';
import TableView from '../TableView/TableView.tsx';
import {IAssembly} from '../../models/models.ts';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import Cookies from "js-cookie";
import {useNavigate, useParams} from "react-router-dom";
import MyComponent from "../Popup/Popover.tsx";

interface TenderCardProps {
    setPage: (name: string, id: number) => void
}


const AssemblyCard: FC<TenderCardProps> = ({setPage}) => {
    const {assembly_id} = useParams();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const {singleAssembly, success, error} = useAppSelector(state => state.assemblyReducer)
    const [assemblyName, setAssemblyName] = useState('$');
    const role = Cookies.get('role')

    useEffect(() => {
        if (assembly_id) {
            dispatch(fetchAssemblyById(assembly_id, setPage))
        }
    }, []);

    const handleDeleteAssembly = (id: number) => {
        dispatch(deleteAssembly(id))
        navigate(-1);
    }

    const handleMakeRequest = (id: number) => {
        dispatch(makeAssembly(id))
        navigate("/request");
    }

    const handleSave = (id: number, assembly: IAssembly) => {
        dispatch(
            updateAssembly(
                id,
                assemblyName == '$' ? assembly.assembly_name : assemblyName,
            )
        )
    }

    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <div className='mx-5 mb-5'>
                {
                    singleAssembly && <>
                        {/* ======================= ШАПКА =============================== */}

                        <div className="card">
                            <h3>Статус: {singleAssembly.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                        <h4>Имя: {emptyString(singleAssembly.user_name, "Имя не задано")}</h4>
                                        <h4>Логин: {emptyString(singleAssembly.user_login, 'Логин на задан')}</h4>
                                </div>

                            </div>
                            <div className="detail-info">
                                {singleAssembly.status !="черновик" && <label>Сформирована: {DateFormat(singleAssembly.formation_date)}</label>}
                                <label htmlFor="assemblyNameInput" style={{ color: 'white' }}>
                                    <h4 style={{textAlign: 'left'}}>Название поставщика:</h4>
                                </label>
                                <input
                                    type="text"
                                    id="assemblyNameInput"
                                    className="form-control bg-black text-white"
                                    value={assemblyName === "$" ? singleAssembly.assembly_name : assemblyName}
                                    onChange={(e) => setAssemblyName(e.target.value)}
                                    style={{ marginBottom: '20px' }}
                                    disabled={singleAssembly.status !== 'черновик'}
                                />

                            </div>
                            <div style={{textAlign: 'right'}}>
                                {singleAssembly.status == 'черновик' && <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => handleSave(singleAssembly.id, singleAssembly)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>

                        {/* ======================= ТАБЛИЦА ============================= */}

                        <TableView
                            setPage={setPage}
                            assemblyID={assembly_id ?? ''}
                            autopartAssembly={singleAssembly.autopart_assemblies}
                            status={singleAssembly.status}
                        />

                        {/* ======================= КНОПКИ ============================= */}

                        <div className='delete-make' style={{display: 'flex', gap: '10px'}}>
                            {singleAssembly.status != 'удален' && singleAssembly.status == 'черновик' && role == '0' && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDeleteAssembly(singleAssembly.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            )}

                            {singleAssembly.status == 'черновик' && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light"
                                        onClick={() => handleMakeRequest(singleAssembly.id)}
                                    >
                                        Сформировать
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default AssemblyCard;
