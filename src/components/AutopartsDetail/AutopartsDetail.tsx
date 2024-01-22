import {FC, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {IAutopart, mockAutoparts} from '../../models/models.ts';
import './AutopartsCard.css'

interface AutopartDetailProps {
    setPage: (name: string, id: number) => void
}

const AutopartsDetail: FC<AutopartDetailProps> = ({setPage}) => {
    const params = useParams();
    const [autopart, setAutopart] = useState<IAutopart | null>(null);
    const navigate = useNavigate();

    const BackHandler = () => {
        navigate('/autoparts');
    }

    useEffect(() => {
        fetchAutopart()
            .catch((err) => {
                console.error(err);
                console.log(params.id);
                const previewID = params.id !== undefined ? parseInt(params.id, 10) - 1 : 0;
                const mockAutopart = mockAutoparts[previewID]
                setPage(mockAutopart.name ?? "Без названия", mockAutopart.autopart_id)
                setAutopart(mockAutopart);
            });

    }, [params.id]);

    async function fetchAutopart() {
        try {
            const response = await fetch(`http://localhost:8080/api/autoparts/${params.id}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPage(data.autopart?.name ?? "Без названия", data.autopart.autopart_id)
            setAutopart(data.autopart);
        } catch (error) {
            console.error('Error fetching autopart data', error);
            throw error;
        }
    }


    if (!autopart) {
        return <div>Loading...</div>;
    }

    return (
        !autopart
            ? <div>Loading...</div>
            : <div className="autopart-card-body">
                <div className="card-container">
                    <h3>{autopart?.name}</h3>
                    <img
                        className="round"
                        src={autopart?.image || '/DevelopmentNetworkApplicationFrontend/default.jpg'}
                        alt={autopart?.name}
                    />
                    <p>Бренд: {autopart?.brand}</p>
                    <p>Модель: {autopart?.model}</p>
                    <p>Год: {autopart?.year}</p>
                    <p>Цена: {autopart?.price} Руб.</p>
                    <p>Описание: {autopart?.description}</p>
                    <div className="buttons">
                        <button className="primary" onClick={BackHandler}>Назад</button>
                        <div></div>
                    </div>
                </div>
            </div>
    );
};

export default AutopartsDetail;
