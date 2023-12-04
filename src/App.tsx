import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import AutopartsList from "./components/AutopartsList/AutopartsList.tsx";
import AutopartsDetail from "./components/AutopartsDetail/AutopartsDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";


function App() {
    const AutopartsPage = {name: 'Запчасти', to: 'autoparts'};
    const [searchValue, setSearchValue] = useState('')
    const [pages, setPage] = useState<IBreadCrumb[]>([AutopartsPage])
    const addPage = (newPage: IBreadCrumb[]) => {
        setPage(newPage);
    };
    const resetSearchValue = () => {
        setSearchValue('');
    };

    return (
        <>
            <NavigationBar handleSearchValue={(value) => setSearchValue(value)}/>
            <BreadCrumbs pages={pages}/>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="autoparts"/>}/>
                    <Route path="/autoparts"
                           element={
                               <AutopartsList
                                   setPage={() => addPage([AutopartsPage])}
                                   searchValue={searchValue}
                                   resetSearchValue={resetSearchValue}
                               />
                           }
                    />
                    <Route path="/autoparts/:id" element={
                        <AutopartsDetail
                            setPage={(name, id) => addPage([
                                AutopartsPage, {name: `${name}`, to: `autoparts/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
