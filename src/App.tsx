import {Routes, Route} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import AutopartsList from "./components/AutopartsList/AutopartsList.tsx";
import AutopartDetail from "./components/AutopartDetail/AutopartDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {Breadcrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";
import AutopartTable from "./components/AutopartTable/AutopartTable.tsx";
import CreateAutopartPage from "./components/TableView/AddAutopart.tsx";
import AssemblyCard from "./components/RequestView/AssemblyCard.tsx";
// import Menu from "./components/Menu/Menu.tsx";

function App() {
    const homePage: Breadcrumb = {name: 'Главная', to: 'autoparts'};
    const addCompanyPage: Breadcrumb = {name: 'Созадние автозапчастей', to: 'add-autopart'};
    const companiesTablePage: Breadcrumb = {name: 'Таблица автозапчастей', to: 'autoparts/admin'};
    const companiesPage: Breadcrumb = {name: 'Автозапчасти', to: 'autoparts'};
    const requestPage: Breadcrumb = {name: 'Заявки', to: 'request'};
    const [pages, setPage] = useState<Breadcrumb[]>([companiesPage])
    const addPage = (newPage: Breadcrumb[]) => {
        setPage(newPage);
    };

    return (
        <>
            <NavigationBar/>
            <BreadCrumbs paths={pages}/>
            <>
                <Routes>

                    <Route path="/autoparts" element={
                        <AutopartsList
                            setPage={() => addPage([homePage])}
                        />
                    }/>

                    <Route path="/autoparts" element={
                        <AutopartsList
                            setPage={() => addPage([homePage, companiesPage])}
                        />
                    }
                    />

                    <Route path="/request" element={
                        <RequestView
                            setPage={() => addPage([homePage, requestPage])}
                        />
                    }
                    />

                    <Route path="/add-autopart" element={
                        <CreateAutopartPage
                            setPage={() => addPage([homePage, addCompanyPage])}
                        />}
                    />

                    <Route path="/add-autopart-2" element={
                        <CreateAutopartPage
                            setPage={() => addPage([homePage, companiesTablePage, addCompanyPage])}
                        />}
                    />

                    <Route path="/login" element={<LoginPage/>}/>

                    <Route path="/autoparts/admin" element={
                        <AutopartTable
                            setPage={() => addPage([homePage, companiesTablePage])}
                        />}
                    />

                    <Route path="/register" element={<RegisterPage/>}/>

                    <Route path="/assemblies/:assembly_id" element={
                        <AssemblyCard setPage={
                            (id) => addPage([
                                homePage,
                                requestPage,
                                {name: `Поставщик`, to: `assemblies/${id}`}
                            ])
                        }/>
                    }/>

                    <Route path="/autoparts/:id" element={
                        <AutopartDetail
                            setPage={(name, id) => addPage([
                                homePage,
                                companiesPage,
                                {name: `${name}`, to: `autoparts/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
