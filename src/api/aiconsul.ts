import axios from "@/axios";

export function getHistoryList(querys:object){
    return axios.get(`/psychological-chat/sessions`,{params:querys})
}

export function deleteHistorySession(sessionId:string | number){
    return axios.delete(`/psychological-chat/sessions/${sessionId}`)
}

export function startNewSession(sessionTitle:string,initialMessage:string){
    return axios.post(`/psychological-chat/session/start`,{sessionTitle,initialMessage})
}

export function getHistorySessionMessages(sessionId:string| number){
    return axios.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotion(sessionId:string| number){
    return axios.get(`/psychological-chat/session/${sessionId}/emotion`)
}