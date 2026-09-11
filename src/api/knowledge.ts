import axios from "@/axios";

export function getKnowledgeList(data:any){
    return axios.get('/knowledge/article/page',{params:data})
}

export function getKnowledgeCategory(){
    return axios.get('/knowledge/category/tree')
}