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
// import Button from "react-bootstrap/Button";

interface AutopartsListProps {
    setPage: () => void
}

const AutopartsList: FC<AutopartsListProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {autoparts, isLoading, error, success /*,draftID*/} = useAppSelector(state => state.autopartReducer)
    const navigate = useNavigate();
    const {searchValue} = useAppSelector(state => state.progressReducer)

    useEffect(() => {
        setPage()
        dispatch(fetchAutoparts(searchValue))
    }, [searchValue]);

    if (!autoparts) {
        return <h3>Данных нет</h3>
    }

    return (
        <>
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
