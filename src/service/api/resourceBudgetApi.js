import axios from "./axios";

const url = 'ResourceBudget'

class ResourceBudget {
    getAll() {
        return axios.get(url);
    }
}

export default new ResourceBudget();