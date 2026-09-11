import axios from "@/axios";

export function logout(){
    return axios.post('/user/logout')
}