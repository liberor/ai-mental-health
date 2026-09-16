import axios from "@/axios";

export function getEmotionals(data:any){
    return axios.get('/emotion-diary/admin/page',{params:data})
}

export function deleteEmotionalById(id:string| number){
    return axios.delete(`/emotion-diary/admin/${id}`)
}