import axios from 'axios'

const API = axios.create({
    baseURL: "http://localhost:3001/api",
})

API.interceptors.request.use(cfg =>) {
    consttoken = localStorage.getItem("token")
}