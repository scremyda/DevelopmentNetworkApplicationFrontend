import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {IAutopart, mockAutoparts} from "../../models/models.ts";
import List from "../List.tsx";
import AutopartItem from "../AutopartItem/AutopartItem.tsx";
import './AutopartsList.css'

interface AutopartsListProps {
    setPage: () => void
    searchValue?: string
    resetSearchValue: () => void;
}

const AutopartsList: FC<AutopartsListProps> = ({setPage, searchValue, resetSearchValue}) => {
    const [Autoparts, setAutoparts] = useState<IAutopart[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setPage()
        if (!reloadPage) {
            fetchAutoparts().catch((err) => {
                console.log(err)
                filterMockData()
            });
        }
    }, [searchValue, reloadPage]);

    useEffect(() => {
        if (reloadPage) {
            setReloadPage(false);
        }
    }, [reloadPage]);

    const fetchAutoparts = async () => {
        const url = 'http://localhost:8080/api/autoparts/get-all' + `?autopart=${searchValue ?? ''}`;

        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(1000)
        })

        if (!response.ok) {
            setServerStatus(false)
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setServerStatus(true)
        if (data.autoparts.autoparts_list == null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")
            resetSearchValue()
        }
        setAutoparts(data.autoparts.autoparts_list ?? []);
    }

    const filterMockData = () => {
        if (searchValue) {
            const filteredAutoparts = mockAutoparts.filter(autopart =>
                autopart.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
            );
            if (filteredAutoparts.length === 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                document.getElementById('search-text-field').value = ""
                alert("Данных нету")
                resetSearchValue()
            }
            setAutoparts(filteredAutoparts);
        } else {
            setAutoparts(mockAutoparts);
        }
    }

    return (
        <List items={Autoparts} renderItem={(autopart: IAutopart) =>
            <AutopartItem
                key={autopart.autopart_id}
                autopart={autopart}
                isServer={serverIsWork}
                onClick={(num) => navigate(`/autoparts/${num}`)}
                reloadPage={() => {
                    setReloadPage(true)
                }}
            />
        }
        />
    );
};

export default AutopartsList;
