import {FC} from 'react';
import {IAutopart} from '../../models/models.ts';
import './CardItem.css'


interface AutopartItemProps {
    autopart: IAutopart;
    onClick: (num: number) => void,
    isServer: boolean
    reloadPage: () => void
}

const AutopartItem: FC<AutopartItemProps> = ({autopart, onClick, isServer, reloadPage}) => {
    const deleteClickHandler = () => {
        DeleteData()
            .then(() => {
                console.log(`Autopart with ID ${autopart.autopart_id} successfully deleted.`);
            })
            .catch(error => {
                alert(`Failed to delete autopart with ID ${autopart.autopart_id}: ${error}`)
            });
    }

    const DeleteData = async () => {
        const response = await fetch('http://localhost:8080/api/autoparts/' + autopart.autopart_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',

            },
        });
        if (response.status === 200) {
            reloadPage()
            return
        }
        throw new Error(`status code = ${response.status}`);
    }

    return (
        <div className="card-autopart-item" data-autopart-id={autopart.autopart_id}>
            <div>
                <img
                    src={autopart?.image || '/DevelopmentNetworkApplicationFrontend/default.jpg'}
                    alt="Image"
                    className="photo"
                    onClick={() => onClick(autopart.autopart_id)}
                    id={`photo-${autopart.autopart_id}`}
                />
                {isServer && (
                    <div className="circle" onClick={deleteClickHandler}>
                        <img
                            src="/DevelopmentNetworkApplicationFrontend/deleteTrash.png"
                            alt="Del"
                            className="deleted-trash"
                        />
                    </div>
                )}
            </div>
            <div className="container-card" onClick={() => onClick(autopart.autopart_id)}> {autopart.name} </div>
        </div>
    );
};

export default AutopartItem;
