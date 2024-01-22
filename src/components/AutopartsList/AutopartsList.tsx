import {useNavigate} from 'react-router-dom';
import {FC, useEffect} from 'react';
import {IAutopart} from "../../models/models.ts";
import List from "../List.tsx";
import AutopartItem from "../AutopartItem/AutopartItem.tsx";
import './AutopartsList.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchAutoparts} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Button, Form} from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
// import {progressSlice} from "../../store/reducers/ProgressData.ts";
import {searchSlice} from "../../store/reducers/SearchSlice.ts";
import {RootState} from "../../store/store.ts";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import Nav from "react-bootstrap/Nav";

interface AutopartsListProps {
    setPage: () => void
    draftID: number | null
    setDraftID: (draftID: number | null) => void;
}

const AutopartsList: FC<AutopartsListProps> = ({setPage, draftID, setDraftID}) => {
    const dispatch = useAppDispatch()
    const {autoparts, isLoading, error, success /*,draftID*/} = useAppSelector(state => state.autopartReducer)
    const navigate = useNavigate();
    const searchText = useSelector((state: RootState) => state.searchReducer.type);

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        dispatch(fetchAutoparts(searchText))
    }

    useEffect(() => {
        setPage();
        const fetchAutopartsAndSetDraft = async () => {
            const draftId = await dispatch(fetchAutoparts(searchText));
            setDraftID(draftId);
        };
        fetchAutopartsAndSetDraft();
    }, [dispatch]);

    if (!autoparts) {
        return <h3>Данных нет</h3>
    }

    return (
        <>
            <Nav.Item className="mx-2">
                <FontAwesomeIcon
                    icon={faShoppingCart}
                    className={`my-2 mr-2 ${draftID === 0 ? 'disabled' : ''}`}
                    onClick={() => draftID !== 0 && navigate(`/assemblies/${draftID}`)}
                    style={{
                        cursor: draftID === 0 ? 'not-allowed' : 'pointer',
                        fontSize: draftID === 0 ? '1.5em' : '2em', // Измените размер в зависимости от условия
                        color: draftID === 0 ? '#777777' : 'black', // Измените цвет в зависимости от условия
                        transition: 'color 0.3s ease', // Добавьте плавный переход цвета
                    }}
                />
            </Nav.Item>
            <Form onSubmit={handleSearch} className="d-flex">
                <FormControl
                    id={'search-text-field'}
                    type="text"
                    value={searchText}
                    placeholder="Поиск автозапчастей"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => dispatch(searchSlice.actions.setType(e.target.value))}
                />
                <Button type="submit" variant="outline-dark">
                    Поиск
                </Button>

            </Form>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <List items={autoparts ?? []} renderItem={(autopart: IAutopart) =>
                <AutopartItem
                    key={autopart.autopart_id}
                    autopart={autopart}
                    isServer={true}
                    onClick={(num) => navigate(`/autoparts/${num}`)}
                    setDraftID={setDraftID}
                />
            }
            />
        </>
    )
};

export default AutopartsList;
