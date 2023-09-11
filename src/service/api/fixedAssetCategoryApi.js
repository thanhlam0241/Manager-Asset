import axios from './axios'

const fixedAssetCategoryRoute = '/FixedAssetCategories';

class FixedAssetCategoryApi {
    getAll() {
        return axios.get(`${fixedAssetCategoryRoute}`)
    }
    get(id) {
        return axios.get(`${fixedAssetCategoryRoute}/${id}`)
    }
    create(data) {
        return axios.post(`${fixedAssetCategoryRoute}`, data)
    }
    update(id, data) {
        return axios.put(`${fixedAssetCategoryRoute}/${id}`, data)
    }
    delete(id) {
        return axios.delete(`${fixedAssetCategoryRoute}/${id}`)
    }
}

export default new FixedAssetCategoryApi()