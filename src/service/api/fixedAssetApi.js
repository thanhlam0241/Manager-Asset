import axios from './axios'

const fixedAssetRoute = '/FixedAssets';

class FixedAssetApi {
    getAll() {
        return axios.get(`${fixedAssetRoute}`)
    }
    get(id) {
        return axios.get(`${fixedAssetRoute}/${id}`)
    }
    getNewCode() {
        return axios.get(`${fixedAssetRoute}/new-code`)
    }
    getFilter(filter) {
        let filterQuery = [];
        let dataBody = {}
        if (filter.pageSize) {
            filterQuery.push(`pageSize=${filter.pageSize}`)
        }
        if (filter.pageNumber) {
            filterQuery.push(`pageNumber=${filter.pageNumber}`)
        }
        if (filter.filterString) {
            filterQuery.push(`filterString=${filter.filterString}`)
        }
        if (filter.departmentIds) {
            dataBody.departmentIds = filter.departmentIds.split(',')
        }
        if (filter.fixedAssetCategoryIds) {
            dataBody.fixedAssetCategoryIds = filter.fixedAssetCategoryIds.split(',')
        }
        return axios.post(`${fixedAssetRoute}/filter?${filterQuery.length > 0 ? filterQuery.join('&') : ''}`, dataBody)
    }
    getFilterExcept(filter) {
        let filterQuery = [];
        let dataBody = {}
        if (filter.pageSize) {
            filterQuery.push(`pageSize=${filter.pageSize}`)
        }
        if (filter.pageNumber) {
            filterQuery.push(`pageNumber=${filter.pageNumber}`)
        }
        if (filter.filterString) {
            filterQuery.push(`filterString=${filter.filterString}`)
        }
        if (filter.codeExcepts) {
            dataBody.codeExcepts = filter.codeExcepts
        }
        return axios.post(`${fixedAssetRoute}/filter-except?${filterQuery.length > 0 ? filterQuery.join('&') : ''}`, dataBody)
    }
    async exportExcel(filter, callback) {
        if (typeof callback === 'function') {
            callback();
        }
        let filterQuery = [];
        let dataBody = {}
        if (filter.stringFilter) {
            filterQuery.push(`stringFilter=${filter.stringFilter}`)
        }
        if (filter.departmentIds) {
            dataBody.departmentIds = filter.departmentIds.split(',')
        }
        if (filter.fixedAssetCategoryIds) {
            dataBody.fixedAssetCategoryIds = filter.fixedAssetCategoryIds.split(',')
        }
        const data = await axios.post(`${fixedAssetRoute}/export?${filterQuery.join('&')}`, dataBody, {
            responseType: 'arraybuffer'
        })

        if (data) {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            let fileURL = URL.createObjectURL(blob)
            let fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.click();
        }

    }
    async importMulti(entityCreateDtos) {
        // console.log(entityCreateDtos)

        // var formData = new FormData();

        // formData.append("entities", JSON.stringify(entityCreateDtos));

        return axios.post(`${fixedAssetRoute}/multiple`, {
            fixedAssetCreateDtos: entityCreateDtos
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
    }
    deleteMany(ids) {
        return axios.delete(`${fixedAssetRoute}/multiple`, { data: ids })
    }
    create(data) {
        return axios.post(`${fixedAssetRoute}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    update(id, data) {
        return axios.put(`${fixedAssetRoute}/${id}`, data)
    }
    delete(id) {
        return axios.delete(`${fixedAssetRoute}/${id}`)
    }
}

export default new FixedAssetApi()