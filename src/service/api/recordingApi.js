import axios from './axios';

const recordingRoute = '/Recordings';

const recordingAssetRoute = '/RecordingAsset';

class RecordingApi {
    getAll() {
        return axios.get(`${recordingRoute}`);
    }
    getAllAsset(id) {
        return axios.get(`${recordingAssetRoute}/${id}`);
    }
    get(id) {
        return axios.get(`${recordingRoute}/${id}`);
    }
    getAssetByRecordingId(id) {
        if (!id) return 'Id không được để trống'
        return axios.get(`${recordingAssetRoute}/${id}`);
    }
    getFilter(filter) {
        let filterQuery = [];
        if (filter.size) {
            filterQuery.push(`pageSize=${filter.size}`)
        }
        if (filter.page) {
            filterQuery.push(`pageNumber=${filter.page}`)
        }
        if (filter.search) {
            filterQuery.push(`filterString=${filter.search}`)
        }
        return axios.get(`${recordingRoute}/filter?${filterQuery.length > 0 ? filterQuery.join('&') : ''}`)
    }
    getNewCode() {
        return axios.get(`${recordingRoute}/new-code`);
    }
    create(data) {
        return axios.post(`${recordingAssetRoute}`, data);
    }
    update(id, data) {
        return axios.put(`${recordingRoute}/${id}`, data);
    }
    delete(id) {
        return axios.delete(`${recordingRoute}/${id}`);
    }
    deleteMulti(ids) {
        return axios.delete(`${recordingRoute}/multiple`, { data: ids });
    }
}

export default new RecordingApi();