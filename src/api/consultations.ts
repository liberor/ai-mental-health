import axios from "@/axios";

export function getConsultations(data:any){
    return axios.get('/psychological-chat/sessions',{params:data})
}

export function getConsultationById(sessionId:any){
    return axios.get(`/psychological-chat/sessions/${sessionId}/messages`)
}