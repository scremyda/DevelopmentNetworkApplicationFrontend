import {useState, ChangeEvent, FormEvent, FC, useEffect} from 'react';
import {Button, Form, Container, Row, Col} from 'react-bootstrap';
import {createAutopart} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import MyComponent from "../Popup/Popover.tsx";
import Cookies from "js-cookie";

interface AutopartData {
    autopartName: string;
    description: string;
    image: File | null;
    price: number;
}

interface AddCompanyProps {
    setPage: () => void
}

const CreateAutopartPage: FC<AddCompanyProps> = ({setPage}) => {
    const [autopartData, setAutopartData] = useState<AutopartData>({
        autopartName: '',
        description: '',
        image: null,
        price: 0,
    });
    const {error, success} = useAppSelector(state => state.autopartReducer)
    const role = Cookies.get('role')
    const dispatch = useAppDispatch()
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setAutopartData({...autopartData, [name]: value});
    };

    useEffect(() => {
        setPage()
    }, []);

    const save = () => {
        console.log('Autopart data submitted:', autopartData);
        dispatch(createAutopart(autopartData.autopartName, autopartData.description, autopartData.price, autopartData.image))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            autopartData.image = file
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Handle form submission logic, e.g., dispatching data to the server
        console.log('Autopart data submitted:', autopartData);
    };

    if (role != '2') {
        return <h2>нет прав</h2>
    }
    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h2>Добаление автозапчастей</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formCompanyName">
                                <Form.Label>Название автозапчасти</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Название"
                                    name="autopartName"
                                    value={autopartData.autopartName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCompanyPrice">
                                <Form.Label>Цена</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Название"
                                    name="price"
                                    value={autopartData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCityDescription">
                                <Form.Label>Описание автозапчасти</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Описание"
                                    name="description"
                                    value={autopartData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formCompanyImage">
                                <Form.Label>Логотип автозапчасти</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{marginTop: '30px'}} onClick={save}>
                                Создать
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CreateAutopartPage;
