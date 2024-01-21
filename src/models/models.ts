export interface IAutopartsResponse {
    autoparts: IAutopartsResponseAutoparts,
    status: string,
}

export interface IAutopartsResponseAutoparts {
    draft_id: number,
    autoparts_list: IAutopart[],
}

export interface IAutopartsResponseAutopart {
    autopart: IAutopart,
    status: string,
}

export interface IAutopartResponse {
    city: IAutopart,
    status: string
}

export interface IStatus {
    id: number,
    status_name: string,
}

export interface IAutopart {
    autopart_id: number,
    description: string,
    name: string,
    brand: string,
    model?: string,
    year?: number,
    image?: string,
    user_id?: number,
    is_deleted?: boolean,
    price?: number,
}

export const mockAutoparts: IAutopart[] = [
    {autopart_id: 1, description: 'Задний мотор, ротор(якорь) мотора, Tesla Model 3, Y, 439210', name: "Двигатель Tesla Model 3", brand: 'Tesla', model: 'Tesla Model Y', year: 2023, price: 45800, image: 'https://1gai.ru/uploads/posts/2019-04/1554125530_330014.jpg'},
    {autopart_id: 2, description: 'Левый наружный фонарь Tesla Model X', name: "Фара Tesla Model X", brand: 'Tesla', model: 'Tesla Model X', year: 2022, price: 35700, image: 'https://teslashop.ru/gallery/version/car-part/14564/135067/medium.jpg'},
    {autopart_id: 3, description: 'Батарея высоковольтная на Tesla Model 3 -. 85kWh Оригинальная запчать', name: "Батарея Tesla Model 3", brand: 'Tesla', model: 'Tesla Model 3', year: 2020, price: 390000, image: 'https://057tech.com/pimages/batterypackpi.jpg'},
]
