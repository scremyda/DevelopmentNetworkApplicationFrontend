import {useNavigate} from 'react-router-dom';
import React, {FC, useEffect, useState} from 'react';
import {IAutopart, mockAutoparts} from "../../models/models.ts";
import List from "../List.tsx";
import AutopartItem from "../AutopartItem/AutopartItem.tsx";
import './AutopartsList.css'
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

interface AutopartsListProps {
    setPage: () => void
    searchValue?: string
    handleSearchValue: (value: string) => void
    resetSearchValue: () => void;
}

const AutopartsList: FC<AutopartsListProps> = ({setPage, searchValue, resetSearchValue, handleSearchValue}) => {
    const [autoparts, setAutoparts] = useState<IAutopart[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputValue = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
        handleSearchValue(inputValue);
    };

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
        <div className='mx-auto d-flex flex-column w-100'>
            {/* Поиск */}
            <div>
                <Form onSubmit={handleSearch} className="d-flex align-items-center w-100">
                    <FormControl
                        id={'search-text-field'}
                        type="text"
                        name="search"
                        placeholder="Название детали"
                        className="me-2 w-100"
                        aria-label="Search"
                    />
                    <Button type="submit" variant="outline-dark">Поиск</Button>
                </Form>
            </div>

            {/* Карточки */}
            <List items={autoparts} renderItem={(autopart: IAutopart) => (
                <AutopartItem
                    key={autopart.autopart_id}
                    autopart={autopart}
                    isServer={serverIsWork}
                    onClick={(key) => navigate(`/autoparts/${key}`)}
                    reloadPage={() => {
                        setReloadPage(true)
                    }}
                />
            )}
            />
        </div>

    );
};

export default AutopartsList;
