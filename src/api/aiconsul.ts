import axios from "@/axios";

export function getHistoryList(querys:object){
    return axios.get(`/psychological-chat/sessions`,{params:querys})
}

export function deleteHistorySession(sessionId){
    return axios.delete(`/psychological-chat/sessions/${sessionId}`)
}

export function startNewSession(sessionTitle,initialMessage){
    return axios.post(`/psychological-chat/session/start`,{sessionTitle,initialMessage})
}

export function getHistorySessionMessages(sessionId){
    return axios.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotion(sessionId){
    return axios.get(`/psychological-chat/session/${sessionId}/emotion`)
}