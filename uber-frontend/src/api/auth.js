import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export const initiateLogin = async (phone) => {
    try {
        const response = await axios.post(`${API_URL}accounts/log-initiate/`, { phone });

        return {
            error: false,
            message: response.data.msg || "OTP sent",
        };

    } catch (error) {
        if (error.response) {
            console.log(error.response.status)
            return {
                error: true,
                status: error.response.status,
                message: error.response.data.msg || error.response.data.error || "Login failed",
            };
        } else {
            return {
                error: true,
                message: "Network error. Please try again.",
            };
        }
    }
};


export const verfiyLogin = async(otp_input,phone)=>{
    try {
        const response = await axios.post(`${API_URL}accounts/log-verify/`,{otp_input,phone})
        console.log('userid in auth',response.data.id)
        return{
            error:false,
            tokens:response.data.tokens,
            userType:response.data.user_type,
            userId:response.data.id,
            message:response.data.msg || "otp verified"
        }
    } catch (error) {
        if(error.response){
             return{
            error:true,
            message:error.response.data.msg || error.response.data.error || "failed"
        }
        }else{
            return{
                error:true,
                message:"N/w error"
            }
        }
       
        
    }
}



