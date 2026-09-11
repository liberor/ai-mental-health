import axios from "@/axios";

export function getKnowledgeList(data:any){
    return axios.get('/knowledge/article/page',{params:data})
}

export function getKnowledgeCategory(){
    return axios.get('/knowledge/category/tree')
}

export function createKnowledge(data:any){
    return axios.post('/knowledge/article',data)
}

export function updateKnowledgeStatus(id:any,data:any){
    return axios.put(`/knowledge/article/${id}/status`,data)
}

export function deleteKnowledge(id:any){
    return axios.delete(`/knowledge/article/${id}`)
}

export function updateKnowledge(id:any,data:any){
    return axios.put(`/knowledge/article/${id}`,data)
}