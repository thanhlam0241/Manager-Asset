import axios from './axios';

const recordingRoute = '/Recordings';

class RecordingApi {
    getAll() {
        return axios.get(`${recordingRoute}`);
    }
    get(id) {
        return axios.get(`${recordingRoute}/${id}`);
    }
    getFilter(filter) {
        let filterQuery = [];
        if (filter.pageSize) {
            filterQuery.push(`pageSize=${filter.pageSize}`)
        }
        if (filter.pageNumber) {
            filterQuery.push(`pageNumber=${filter.pageNumber}`)
        }
        if (filter.filterString) {
            filterQuery.push(`filterString=${filter.filterString}`)
        }
        return axios.post(`${recordingRoute}/filter?${filterQuery.length > 0 ? filterQuery.join('&') : ''}`)
    }
    getNewCode() {
        return axios.get(`${recordingRoute}/new-code`);
    }
    create(data) {
        return axios.post(`${recordingRoute}`, data);
    }
    update(id, data) {
        return axios.put(`${recordingRoute}/${id}`, data);
    }
    delete(id) {
        return axios.delete(`${recordingRoute}/${id}`);
    }
}

export default new RecordingApi();