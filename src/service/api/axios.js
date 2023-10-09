import axios from 'axios'

import { exceptionResource, typeAction } from '@/assets/resources/response'
import { types, dataTypes, eventBus } from '@/assets/resources/common'

import emitter from '@/helper/emitter'

import store from '@/store/store'

const baseUrl = '/api';
// const baseUrl = 'https://localhost:7291/api/v1';

const instance = axios.create({
    baseURL: baseUrl,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

const sendEmitted = (type, message) => {
    emitter.emit(eventBus.TOAST_MESSAGE, {
        type: type,
        message: message
    })
}

instance.interceptors.request.use(async (config) => {
    // Handle token here ...
    return config;
});
instance.interceptors.response.use((response) => {
    // Handle response here ...
    console.log(response)
    switch (response.status) {
        case 201:
            // Handle Unauthorized calls here
            // Display an alert
            if (typeof response.data === dataTypes.STRING)
                sendEmitted(typeAction.SUCCESS, response.data)
            break;
        case 202:
            // Handle Unauthorized calls here
            // Display an alert
            if (typeof response.data === dataTypes.STRING)
                sendEmitted(typeAction.SUCCESS, response.data)
            break;
        case 204:
            // Handle 404 here
            // redirect
            if (typeof response.data === dataTypes.STRING)
                sendEmitted(typeAction.SUCCESS, response.data)
            break;
    }
    return response.data
}, (error) => {
    console.log(error)
    const lang = store.state.lang
    if (error.code === types.ERR_NETWORK) {
        sendEmitted(types.ERROR, error.message || exceptionResource[lang].NETWORK)
    }
    else if (error.response) {
        console.log(error.response)
        switch (error.response.status) {
            case 400:
                // Handle Bad Request here
                // Display an alert
                if (typeof error.response.data === dataTypes.STRING)
                    sendEmitted(typeAction.ERROR, error.response.data)
                else
                    sendEmitted(types.ERROR, error.response.data.UserMessage || exceptionResource[lang].BAD_REQUEST)
                break;
            case 401:
                // Handle Unauthorized calls here
                // Display an alert if (typeof error.response.data === dataTypes.STRING)
                if (typeof error.response.data === dataTypes.STRING) {
                    sendEmitted(typeAction.INFO, error.response.data || 'Vui lòng đăng nhập lại.')
                }
                else
                    sendEmitted(types.ERROR, error.response.data.UserMessage || exceptionResource[lang].UNAUTHORIZED)
                sendEmitted(typeAction.ERROR, "Phiên làm việc đã hết hạn. Đăng nhập lại")
                break;
            case 404:
                // Handle 404 here
                // redirect
                if (typeof error.response.data === dataTypes.STRING)
                    sendEmitted(typeAction.ERROR, error.response.data)
                else
                    sendEmitted(types.ERROR, error.response.data.UserMessage || exceptionResource[lang].NOT_FOUND)
                break;
            case 406:
                // Handle 404 here
                // redirect
                if (typeof error.response.data === dataTypes.STRING)
                    sendEmitted(typeAction.INFO, error.response.data)
                else
                    sendEmitted(types.INFO, error.response.data.UserMessage || exceptionResource[lang].NOT_ACCEPTABLE)
                break;
            case 409:
                // Handle 409 here
                // redirect
                if (typeof error.response.data === dataTypes.STRING)
                    sendEmitted(typeAction.ERROR, error.response.data)
                else
                    sendEmitted(types.ERROR, error.response.data.UserMessage || exceptionResource[lang].CONFLICT)
                break;
            default:
                // Handle 500 here
                // redirect
                if (typeof error.response.data === dataTypes.STRING)
                    sendEmitted(typeAction.ERROR, error.response.data)
                else
                    sendEmitted(types.ERROR, error.response.data.UserMessage || exceptionResource[lang].INTERNAL_SERVER_ERROR)
                break;
            // and so on..
        }
        return Promise.reject(error.response);
    }
});

export default instance;