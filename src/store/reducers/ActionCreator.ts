import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    IAutopartResponse,
    IAutopartWithDraft,
    IDeleteAutopartAssembly,
    IAssemblyResponse, IRegisterResponse,
    IRequest,
    IAssembly,
    mockAutoparts, IDefaultResponse
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {autopartSlice} from "./AutopartSlice.ts"
import {assemblySlice} from "./AssemblySlice.ts";
import {userSlice} from "./UserSlice.ts";


export const fetchAutoparts = (searchValue?: string, makeLoading: boolean = true) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const config = {
        method: "get",
        url: '/api/autoparts' + `?autopart_name=${searchValue ?? ''}`,
        headers: {
            Authorization: `Bearer ${accessToken ?? ''}`,
        },
    }

    try {
        if (makeLoading) {
            dispatch(autopartSlice.actions.autopartsFetching())
        }
        const response = await axios<IAutopartWithDraft>(config);
        dispatch(autopartSlice.actions.autopartsFetched([response.data.autoparts, response.data.draft_id]))
    } catch (e) {
        dispatch(autopartSlice.actions.autopartsFetched([filterMockData(searchValue), 0]))
    }
}

export const updateAutopartInfo = (
    id: number,
    autopartName: string,
    description: string,
    status: string,
    price: number
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const config = {
        method: "put",
        url: `/api/autoparts`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            autopart_id: id,
            name: autopartName,
            description: description,
            status: status,
            price: price,
        },
    }

    try {
        dispatch(autopartSlice.actions.autopartsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Данные обновленны' : ''
        dispatch(autopartSlice.actions.autopartAddedIntoAssembly([error, success]))
        dispatch(fetchAutoparts())
    } catch (e) {
        dispatch(autopartSlice.actions.autopartsFetchedError(`Ошибка: ${e}`))
    }
}

export const updateAutopartImage = (cityId: number, file: File) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('autopart_id', `${cityId}`);

    const config = {
        method: "put",
        url: `/api/autoparts/upload-image`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: formData,
    }

    try {
        dispatch(autopartSlice.actions.autopartsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Фото обновленно' : ''
        dispatch(autopartSlice.actions.autopartAddedIntoAssembly([error, success]))
        dispatch(fetchAutoparts())
    } catch (e) {
        dispatch(autopartSlice.actions.autopartsFetchedError(`Ошибка: ${e}`))
    }
}

export const deleteAutopart = (autopartId: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));

    const config = {
        method: "delete",
        url: `/api/autoparts`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: `${autopartId}`
        },
    }

    try {
        dispatch(autopartSlice.actions.autopartsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Автозапчасть удалена' : ''
        dispatch(autopartSlice.actions.autopartAddedIntoAssembly([error, success]))
        dispatch(fetchAutoparts())
    } catch (e) {
        dispatch(autopartSlice.actions.autopartsFetchedError(`Ошибка: ${e}`))
    }
}


export const addAutopartIntoAssembly = (autopartId: number, count: number, autopartName: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "post",
        url: "/api/autoparts/request",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            autopart_id: autopartId,
            count: count
        }
    }

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Автозапчасть "${autopartName}" добавлена`
        dispatch(autopartSlice.actions.autopartAddedIntoAssembly([errorText, successText]));
        dispatch(autopartSlice.actions.setDraft(response.data.id))
        setTimeout(() => {
            dispatch(autopartSlice.actions.autopartAddedIntoAssembly(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(autopartSlice.actions.autopartsFetchedError(`${e}`))
    }
}

export const deleteAssembly = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "delete",
        url: "/api/assemblies",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id
        }
    }
    try {
        dispatch(assemblySlice.actions.assembliesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        dispatch(autopartSlice.actions.setDraft(0))
        dispatch(assemblySlice.actions.assembliesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchAssemblies())
        }
        setTimeout(() => {
            dispatch(assemblySlice.actions.assembliesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesDeleteError(`${e}`))
    }
}

export const makeAssembly = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        //url: "/api/assemblies/form",
        url: "/api/assemblies/user-form-start",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            requestId:id,
            Server_Token:"qwerty",
            status:"сформирован",
        }
    }
    try {
        dispatch(assemblySlice.actions.assembliesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(assemblySlice.actions.assembliesUpdated([errorText, successText]));
        dispatch(autopartSlice.actions.setDraft(0))
        if (successText != "") {
            dispatch(fetchAssemblies())
        }
        setTimeout(() => {
            dispatch(assemblySlice.actions.assembliesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesDeleteError(`${e}`))
    }
}

export const moderatorUpdateStatus = (assemblyId: number, status: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: "/api/assemblies/updateStatus",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            status: status,
            assembly_id: assemblyId
        }
    }
    try {
        dispatch(assemblySlice.actions.assembliesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Ответ принят`
        dispatch(assemblySlice.actions.assembliesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchAssemblies())
        }
        setTimeout(() => {
            dispatch(assemblySlice.actions.assembliesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesDeleteError(`${e}`))
    }
}

export const fetchAssemblies = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(assemblySlice.actions.assembliesFetching())
        const response = await axios.get<IAssemblyResponse>(`/api/assemblies`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            assemblies: response.data.assemblies,
            status: response.data.status
        };

        dispatch(assemblySlice.actions.assembliesFetched(transformedResponse))
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesFetchedError(`${e}`))
    }
}

export const fetchCurrentAssembly = () => async (dispatch: AppDispatch) => {
    interface ISingleAssemblyResponse {
        assemblies: number,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        const response = await axios.get<ISingleAssemblyResponse>(`/api/assemblies/current`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        dispatch(autopartSlice.actions.setDraft(response.data.assemblies))

    } catch (e) {
        dispatch(assemblySlice.actions.assembliesFetchedError(`${e}`))
    }
}

export const fetchAssemblyById = (
    id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    interface ISingleAssemblyResponse {
        assembly: IAssembly,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(assemblySlice.actions.assembliesFetching())
        const response = await axios.get<ISingleAssemblyResponse>(`/api/assemblies/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        setPage(response.data.assembly.assembly_name, response.data.assembly.id)
        dispatch(assemblySlice.actions.assemblyFetched(response.data.assembly))
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesFetchedError(`${e}`))
    }
}

export const fetchAssembliesFilter = (dateStart?: string, dateEnd?: string, status?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(assemblySlice.actions.assembliesFetching())
        const queryParams: Record<string, string | undefined> = {};
        if (dateStart) {
            queryParams.start_date = dateStart;
        }
        if (dateEnd) {
            queryParams.end_date = dateEnd;
        }
        if (status) {
            queryParams.status_id = status;
        }
        const queryString = Object.keys(queryParams)
            .map((key) => `${key}=${encodeURIComponent(queryParams[key]!)}`)
            .join('&');
        const urlWithParams = `/api/assemblies${queryString ? `?${queryString}` : ''}`;
        const response = await axios.get<IAssemblyResponse>(urlWithParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            assemblies: response.data.assemblies,
            status: response.data.status
        };
        // console.log(transformedResponse.hikes)
        dispatch(assemblySlice.actions.assembliesFetched(transformedResponse))
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesFetchedError(`${e}`))
    }
}

export const deleteAssemblyById = (
    id: number,
    assembly_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(assemblySlice.actions.assembliesFetching())
        const response = await axios.delete<IDeleteAutopartAssembly>(`/api/assembly-request-autopart`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            },
        });
        dispatch(assemblySlice.actions.assembliesDeleteSuccess(response.data))
        dispatch(fetchAssemblyById(assembly_id, setPage))
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesFetchedError(`${e}`))
    }
}

export const updateAssemblyAutopart = (
    index: number,
    newCount: number,
    assembly_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/assembly-request-autopart",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            //description: description,
            count: newCount,
            // creation_date: convertInputFormatToServerDate(startDate),
            // completion_date: convertInputFormatToServerDate(endDate),
            id: index,
        }
    };

    try {
        const response = await axios(config);
        //const errorText = response.data.description ?? ""
        //const successText = errorText || "Успешно обновленно"
        //dispatch(assemblySlice.actions.assembliesUpdated([errorText, successText]));
        //dispatch(assemblySlice.actions.assembliesDeleteSuccess(response.data))
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(assemblySlice.actions.assembliesUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(assemblySlice.actions.assembliesUpdated(['', '']));
        }, 5000);
        dispatch(fetchAssemblyById(assembly_id, setPage))
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesFetchedError(`${e}`))
    }
}

export const updateAssembly = (
    id: number,
    //description: string,
    assemblyName: string,
    // startDate: string,
    // endDate: string,
    //leader: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/assemblies",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            //description: description,
            assembly_name: assemblyName,
            // creation_date: convertInputFormatToServerDate(startDate),
            // completion_date: convertInputFormatToServerDate(endDate),
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(assemblySlice.actions.assembliesUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(assemblySlice.actions.assembliesUpdated(['', '']));
        }, 5000);
        dispatch(fetchAssemblies())
    } catch (e) {
        dispatch(assemblySlice.actions.assembliesFetchedError(`${e}`));
    }
}

export const fetchAutopart = (
    autopartId: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(autopartSlice.actions.autopartsFetching())
        const response = await axios.get<IAutopartResponse>(`/api/autoparts/${autopartId}`)
        const autopart = response.data.autopart
        setPage(autopart.name ?? "Без названия", autopart.autopart_id)
        dispatch(autopartSlice.actions.autopartFetched(autopart))
    } catch (e) {
        console.log(`Ошибка загрузки автозапчастей: ${e}`)
        const previewID = autopartId !== undefined ? parseInt(autopartId, 10) - 1 : 0;
        const mockAutopart = mockAutoparts[previewID]
        setPage(mockAutopart.name ?? "Без названия", mockAutopart.autopart_id)
        dispatch(autopartSlice.actions.autopartFetched(mockAutopart))
    }
}

export const createAutopart = (
    autopartName?: string,
    description?: string,
    price?: number,
    image?: File | null
) => async (dispatch: AppDispatch) => {
    const formData = new FormData();
    if (autopartName) {
        formData.append('autopart_name', autopartName);
    }
    if (description) {
        formData.append('description', description);
    }
    if (image) {
        formData.append('image_url', image);
    }
    if (price) {
        formData.append('price', price.toString())
    }
    formData.append('status', 'действует');
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/autoparts",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    try {
        dispatch(autopartSlice.actions.autopartsFetching())
        const response = await axios(config);
        const errorText = response.data.description || ''
        const successText = errorText == '' ? "Компания создан" : ''
        dispatch(autopartSlice.actions.autopartAddedIntoAssembly([errorText, successText]))
        setTimeout(() => {
            dispatch(autopartSlice.actions.autopartAddedIntoAssembly(['', '']));
        }, 6000)
    } catch (e) {
        dispatch(autopartSlice.actions.autopartsFetchedError(`${e}`));
    }
}


export const registerSession = (userName: string, login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/user/signUp",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            user_name: userName,
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IRegisterResponse>(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Регистрация прошла успешно"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

export const logoutSession = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/user/logout",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios(config);
        const errorText = response.data.login == '' ? 'Ошибка при попытке выйти' : ''
        const successText = errorText || "Попробуйте ещё раз"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))

        if (errorText == '') {
            Cookies.remove('jwtToken');
            dispatch(userSlice.actions.setAuthStatus(false))
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

export const loginSession = (login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/user/signIn",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IAuthResponse>(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || ""
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        dispatch(userSlice.actions.setRole(response.data.role ?? ''))
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            Cookies.set('role', response.data.role ?? '');
            dispatch(userSlice.actions.setAuthStatus(true));
            Cookies.set('userName', response.data.userName)
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000);
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// MARK: - Mock data

function filterMockData(searchValue?: string) {
    if (searchValue) {
        const filteredAutoparts = mockAutoparts.filter(autopart =>
            autopart.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
        );
        if (filteredAutoparts.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")

        }
        return filteredAutoparts
    }
    return mockAutoparts
}

export function DateFormat(dateString: string) {
    if (dateString == "0001-01-01T00:00:00Z") {
        return "Дата не указана"
    }
    const date = new Date(dateString);
    return `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
}

export function emptyString(text: string, emptyText: string) {
    return text == "" ? emptyText : text
}

export const convertServerDateToInputFormat = (serverDate: string) => {
    const dateObject = new Date(serverDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};
