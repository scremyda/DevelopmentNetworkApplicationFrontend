import {FC} from "react";
import './TableView.css'
import {IAutopartAssemblies} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteAssemblyById, updateAssemblyAutopart} from "../../store/reducers/ActionCreator.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
interface TableViewProps {
    status: string
    autopartAssembly: IAutopartAssemblies[]
    setPage: (name: string, id: number) => void
    assemblyID: string
}

const TableView: FC<TableViewProps> = ({autopartAssembly, status, setPage, assemblyID}) => {
    const dispatch = useAppDispatch()

    const handleDelete = (id: number) => {
        //dispatch(minus())
        dispatch(deleteAssemblyById(id, assemblyID, setPage))
    }

    const handleCountChangePlus = (id: number, count: number) => {
        count += 1
        //dispatch(increase())
        dispatch(updateAssemblyAutopart(id, count, assemblyID, setPage))
    }

    const handleCountChangeMinus = (id: number, count: number) => {
        count = count == 0 ? 0 : count - 1
        //dispatch(minus())
        dispatch(updateAssemblyAutopart(id, count, assemblyID, setPage))
    }

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className="number">Количество</th>
                    <th>Фото автозапчасти</th>
                    <th>Название автозапчасти</th>
                    <th>Описание</th>
                </tr>
                </thead>
                <tbody>
                {autopartAssembly.map((item, index) => (
                    <tr key={index}>
                        <td className="text-center">
                            {status == "черновик" && (
                                <>
                                    <button className="btn btn-sm btn-primary"
                                            onClick={() => handleCountChangeMinus(item.id, item.count)}>
                                        -
                                    </button>
                                    <span className="mx-2">{item.count + 1}</span>
                                    <button className="btn btn-sm btn-primary"
                                            onClick={() => handleCountChangePlus(item.id, item.count)}>
                                        +
                                    </button>
                                </>
                            )}
                            {status != "черновик" && <span>{item.count + 1} </span>}
                        </td>
                        <td className="image-td">
                            <img src={item.autopart.image_url} alt="photo" />
                        </td>
                        <td className="city-name-td">{item.autopart.name}</td>
                        <td>{item.autopart.description}</td>
                        {status === "черновик" && (
                            <td className="delete-td">
                                <FontAwesomeIcon
                                    className="delete-button-td"
                                    icon={faTrash}
                                    onClick={() => handleDelete(item.id)}
                                    size="2x"
                                />
                            </td>

                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default TableView;
