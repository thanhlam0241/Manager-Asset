import axios from './axios.js'

const departmentRoute = '/Departments';
class DepartmentApi {
    getAll() {
        return axios.get(`${departmentRoute}`)
    }
    get(id) {
        return axios.get(`${departmentRoute}/${id}`)
    }
    create(data) {
        return axios.post(`${departmentRoute}`, data)
    }
    update(id, data) {
        return axios.put(`${departmentRoute}/${id}`, data)
    }
    delete(id) {
        return axios.delete(`${departmentRoute}/${id}`)
    }
}

export default new DepartmentApi()