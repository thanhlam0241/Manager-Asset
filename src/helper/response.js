export function getResponseMessage(response) {
    if (response && response.data) {
        const responseData = response.data;
        if (typeof responseData === 'string') {
            return responseData;
        }
        else if (responseData.UserMessage) {
            return responseData.UserMessage;
        }
    }
}