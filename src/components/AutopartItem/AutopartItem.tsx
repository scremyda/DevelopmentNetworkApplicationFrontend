import {FC} from 'react';
import {IAutopart} from '../../models/models.ts';
import './CardItem.css'
import {addAutopartIntoAssembly} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
//import {autopartSlice} from "../../store/reducers/AutopartSlice.ts";


interface AutopartItemProps {
    autopart: IAutopart;
    onClick: (num: number) => void,
    isServer: boolean,
    setDraftID: (draftID: number | null) => void,
}

const AutopartItem: FC<AutopartItemProps> = ({autopart, onClick, isServer, setDraftID})  => {

    const dispatch = useAppDispatch()
    const {isAuth} = useAppSelector(state => state.userReducer)
    const plusClickHandler = async () => {
        const id = await dispatch(addAutopartIntoAssembly(autopart.autopart_id, 0.0, autopart.name ?? "Без названия"))
        setDraftID(id);
    }

    return (
        <div className="card-city-item" data-city-id={autopart.autopart_id}>
            <img
                src={autopart.image_url}
                alt="Image"
                className="photo"
                onClick={() => onClick(autopart.autopart_id)}
                id={`photo-${autopart.autopart_id}`}
            />
            {isServer && isAuth && (
                <FontAwesomeIcon
                    className="circle"
                    icon={faPlus}
                    onClick={() => plusClickHandler()}
                    size="1x"
                />
            )}
            <div className="container-card" onClick={() => onClick(autopart.autopart_id)}>{autopart.name}</div>

        </div>
    );
};

export default AutopartItem;
