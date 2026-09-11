import axios from "@/axios";

export function getBooks(data:any){
    return axios.get('/knowledge/article/page',{params:data})
}