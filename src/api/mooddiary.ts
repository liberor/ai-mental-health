import axios from "@/axios";

export function createOrUpdateDiary(data:any){
    return axios.post('/emotion-diary',data)
}