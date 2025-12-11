import axios from 'axios';


const serverUrl = "http://localhost:4000/";

export const postRequest = async (url, body) => {
    try {
        let { data: response } = await axios.post(serverUrl + url, body, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        return "Axios Error: " + error.message;
    }
}