import axios from "@/axios";

export function getArticle(id){
    return axios.get(`/knowledge/article/${id}`)
}