import axios from 'axios'
const axiosBase= axios.create({
    //  baseURL:'http://localhost:5500/api'
     baseURL:'https://app-608f6c52-b971-43b1-884c-9a8ae64e9839.cleverapps.io/api'
})
export default axiosBase