import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export const requestCab = async(travelData)=>{
    try {
        const response = await axios.post(`${API_URL}customer/cab-request/`,travelData)
        return{
            error:false,
            message:response.data.msg || "request received"
        }
    }catch (error) {
        if(error.response){
                return{
                    error:true,
                    message:error.response.status
                }
        }
        else{
            return{
                error:true,
                message:'server error'
            }
        }
    }
}