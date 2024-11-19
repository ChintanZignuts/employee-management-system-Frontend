import axios from "axios"

axios.defaults.baseURL = "http://98.81.141.113:80/api"

axios.interceptors.request.use(
  function (config) {
    const access_token = localStorage.getItem("token")
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
    }
    
    return config
  },
  function (error) {
    console.log(error)
    
    return Promise.reject(error)
  },
)

export default axios
