import axios, {AxiosResponse} from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.withCredentials = true;


const responseBody = (resp: AxiosResponse) => resp.data;

const Auth = {
    register: (data: any) => axios.post('api/v1/auth', data).then(responseBody),
}

const agent = {
    Auth
};

export default agent;