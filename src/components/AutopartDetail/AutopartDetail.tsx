import {FC, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './AutopartCard.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchAutopart} from "../../store/reducers/ActionCreator.ts";

interface AutopartDetailProps {
    setPage: (name: string, id: number) => void
}

const AutopartDetail: FC<AutopartDetailProps> = ({setPage}) => {
    const params = useParams();
    const dispatch = useAppDispatch()
    const {autopart, isLoading, error} = useAppSelector(state => state.autopartReducer)
    const navigate = useNavigate();

    const BackHandler = () => {
        navigate('/autoparts');
    }

    useEffect(() => {
        dispatch(fetchAutopart(`${params.id}`, setPage))
    }, [params.id]);

    return (
        <>
            {isLoading && <h1> Загрузка данных .... </h1>}
            {error && <h1>Ошибка {error} </h1>}
            {<div className="city-card-body">
                <div className="card-container">
                    <img
                        className="round"
                        src={autopart?.image_url}
                        alt={autopart?.name}
                    />
                    <h3>{autopart?.name}</h3>
                    <h6>Цена: {autopart?.price} Руб.</h6>
                    <h6>Статус: {autopart?.status}</h6>
                    <p>Описание: {autopart?.description}</p>
                    <div className="buttons">
                        <button className="btn btn-primary" onClick={BackHandler}>Назад</button>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default AutopartDetail;
