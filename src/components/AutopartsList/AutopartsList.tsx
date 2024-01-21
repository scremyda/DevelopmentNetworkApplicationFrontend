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
// import Button from "react-bootstrap/Button";

interface AutopartsListProps {
    setPage: () => void
}

const AutopartsList: FC<AutopartsListProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {autoparts, isLoading, error, success /*,draftID*/} = useAppSelector(state => state.autopartReducer)
    const navigate = useNavigate();
    const searchText = useSelector((state: RootState) => state.searchReducer.type);

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        dispatch(fetchAutoparts(searchText))
    }

    useEffect(() => {
        setPage()
        dispatch(fetchAutoparts(searchText))
    }, [dispatch]);

    if (!autoparts) {
        return <h3>Данных нет</h3>
    }

    return (
        <>
            <Form onSubmit={handleSearch} className="d-flex">
                <FormControl
                    id={'search-text-field'}
                    type="text"
                    value={searchText}
                    placeholder="Поиск компаний"
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
                />
            }
            />
        </>
    )
};

export default AutopartsList;
