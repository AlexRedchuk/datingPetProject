import axios from "axios";

const datingBase = axios.create({
    baseURL: 'http://localhost:8080'
})

export default datingBase;