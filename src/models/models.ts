export interface ICompanies {
    cities: IAutopart[],
    status: string
}
export interface IAutopartResponse {
    autopart: IAutopart,
    status: string
}

export interface IAutopart {
    autopart_id: number,
    description: string,
    name: string,
    status: string,
    price: number,
    year: number,
    image_url?: string,
}

export interface IAutopartWithDraft { // ICityWithBasket
    draft_id: number,
    autoparts: IAutopart[],
}

export interface IDefaultResponse {
    description?: string
}

export interface IAutopartAssemblies { // IDestinationHikes
    id: number,
    autopart_id: number,
    assembly_id: number,
    count: number,
    autopart: IAutopart,
}

export interface IRegisterResponse {
    login: string
    password: string
}

export interface IAuthResponse {
    access_token?: string,
    description?: string,
    status?: string,
    role?: string
    userName: string,
    userImage: string
}

export interface UserInfo {
    name: string,
    image: string,
}

export interface IUser {
    id: number,
    name: string,
    login: string,
    password: string,
}

export interface IAssembly {
    id: number,
    assembly_name: string,
    creation_date: string,
    completion_date: string,
    formation_date: string,
    //user_id: number,
    status: string,
    status_check: string,
    user_name: string,
    moderator_name: string,
    user_login: string,
    moderator_login: string,
    //creator_login: string,
    //user: IUser,
    //moderator: IUser
    autopart_assemblies: IAutopartAssemblies[],
}

export interface IRequest {
    assemblies: IAssembly[]
    status: string
}

export interface IAssemblyResponse {
    assemblies: IAssembly[]
    status: string
}

export interface IDeleteAutopartAssembly { // IDeleteDestinationHike
    deleted_autopart_assembly: number, // company_tender
    status: string,
    description?: string,
}

export const mockAutoparts: IAutopart[] = [
    {
        autopart_id: 1,
        description: "Мoдуль оcновнoй выcоковoльтнoй бaтаpeи (75кBт, S3 Modulе), с платой, Теslа Мodel SRеst\n" +
            "\n" +
            "Moдуль батapeи высокoвольтной для Teslа Mоdеl S (2016 - 2021)",
        name: "Модуль батареи",
        year: 2002,
        status: "действует",
        price: 29900,
        image_url: " /RIP_Front/battery.jpg",
    },
    {
        autopart_id: 2,
        description: "Электродвигатель передний, 3.0-150, Tesla Model S, SR, X, 2016",
        name: "Электродвигатель",
        status: "действует",
        year: 2002,
        price: 62100,
        image_url: "/RIP_Front/dvigatel.jpg",
    },
    {
        autopart_id: 3,
        description: "Пиротехнический предохранитель для аккумуляторов Tesla, модель S 70D 2016",
        name: "Предохранитель батареи",
        status: "действует",
        year: 2002,
        price: 27140,
        image_url: "/RIP_Front/predohranitel.jpg",
    },
    {
        autopart_id: 4,
        description: "Блок автопилота 2.5, Tesla Model SR, X, 2017",
        name: "Блок автопилота",
        status: "действует",
        year: 2002,
        price: 130000,
        image_url:"/RIP_Front/avtopilot.jpg"
    },
];

