import axios from './axios';

const url = '/RecordedAsset';

class RecordedAssetApi {
    async getRecordedAsset(id) {
        return await axios.get(`${url}/${id}`);
    }
    async delete(id) {
        return await axios.delete(`${url}/${id}`);
    }
    async update(id, data) {
        return await axios.put(`${url}/${id}`, data);
    }
}

export default new RecordedAssetApi();