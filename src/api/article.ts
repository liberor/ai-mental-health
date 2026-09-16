import axios from "@/axios";

export function getArticle(id:string| number){
    return axios.get(`/knowledge/article/${id}`)
}