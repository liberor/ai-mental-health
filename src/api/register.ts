import axios from "@/axios";

export function register(data:any){
    return axios.post('/user/add',data)
}