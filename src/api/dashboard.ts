import axios from "@/axios";

export function getAllData(){
    return axios.get('/data-analytics/overview')
}