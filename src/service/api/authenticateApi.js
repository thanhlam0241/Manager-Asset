import axios from './axios'

const API_URL = (route) => `Authentication/${route}`

class AuthenticateApi {
    login(data) {
        return axios.post(API_URL('login'), data)
    }
    checkLogin() {
        return axios.get(API_URL('check-login'))
    }
    logout() {
        return axios.get(API_URL('logout'))
    }
}

export default new AuthenticateApi()

