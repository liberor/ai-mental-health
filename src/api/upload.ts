import axios from "@/axios";

export function uploadFile(file: Blob | string, businessInfo: { businessId: string }){
    const formData = new FormData()
    formData.append('file',file)
    formData.append('businessType','ARTICLE')
    formData.append('businessId',businessInfo.businessId)
    formData.append('businessField','cover')
    return axios.post('/file/upload',formData,{
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
}