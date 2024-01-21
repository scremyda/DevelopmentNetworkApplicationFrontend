import React, {FC, useState} from 'react';
import {Button, Form, Col} from 'react-bootstrap';
import {IAutopart} from "../../models/models.ts";
import {deleteAutopart, updateAutopartImage, updateAutopartInfo} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

interface AutopartTableCellProps {
    autopartData: IAutopart
}

const AutopartTableCell: FC<AutopartTableCellProps> = ({autopartData}) => {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(autopartData.name ?? "");
    const [price, setPrice] = useState(autopartData.price ?? "");
    const [description, setDescription] = useState(autopartData.description ?? "");
    const [status, setStatus] = useState(autopartData.status);
    // const [statusId, setStatusId] = useState(`${autopartData.status}`);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleDeleteClick = () => {
        dispatch(deleteAutopart(autopartData.autopart_id))
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        dispatch(updateAutopartInfo(autopartData.autopart_id, name, description, status, price))
        if (imageFile) {
            dispatch(updateAutopartImage(autopartData.autopart_id, imageFile))
        }
        setIsEditing(false);
    };

    const handleInputChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setDescription(value)
    }

    const handleInputChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setName(value)
    }

    const handleInputChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setPrice(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {value} = e.target;
        setStatus(value)
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };



    if (isEditing) {
        return <td colSpan={6}>
            <div>
                <Form className='mx-5'>
                    <Form.Group as={Col} controlId="formCompanyName" className='mt-2'>
                        <Form.Label>Название автозапчасти</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите название автозапчасти"
                            name="name"
                            value={name}
                            onChange={handleInputChangeName}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formCompanyIIN" className='mt-2'>
                        <Form.Label>Название автозапчасти</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите Цену"
                            name="name"
                            value={name}
                            onChange={handleInputChangePrice}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formCompanyStatus" className='mt-2'>
                        <Form.Label>Статус</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={status}
                            onChange={handleInputChange}
                        >
                            <option value="действует">Действует</option>
                            <option value="удален">Удален</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formCompanyDescription" className='mt-2'>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Введите описание автозапчасти"
                            name="description"
                            value={description}
                            onChange={handleInputChangeDescription}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCompanyImage" className='mt-2'>
                        <Form.Label>Картинка</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>

                    <div style={{display: 'flex', justifyContent: 'space-between'}} className='my-3'>
                        <Button variant="primary" onClick={handleSaveClick}>
                            Сохранить изменения
                        </Button>

                        <Button variant='outline-light' onClick={() => {
                            setIsEditing(false)
                        }}>
                            Отменить редактирование
                        </Button>
                    </div>
                </Form>
            </div>
        </td>
    }

    return (
        <>
            <tr key={autopartData.autopart_id}>
                <td>{autopartData.autopart_id}</td>
                <td>{autopartData.name}</td>
                <td>{autopartData.status}</td>
                <td>{autopartData.description}</td>
                <td>{autopartData.image_url &&
                    <img src={autopartData.image_url}
                         alt="City Image"
                         className="img-thumbnail"
                         style={{width: '200px'}}/>
                }</td>
                <div className='my-3' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Button variant="outline-success" onClick={handleEditClick} className='mb-2'>
                        Редактировать
                    </Button>

                    <Button variant="outline-danger" onClick={handleDeleteClick} style={{width: '100%'}}>
                        Удалить
                    </Button>
                </div>
            </tr>
        </>
    )
};

export default AutopartTableCell;
