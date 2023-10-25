export function getObjectIgnoreField(obj, ignoreFields) {
    const result = {}
    for (const key in obj) {
        if (!ignoreFields.includes(key)) {
            result[key] = obj[key]
        }
    }
    return result
}

export function compareDate(date1, date2) {
    const date_1 = new Date(date1)
    const date_2 = new Date(date2)
    return date_1.getDate() === date_2.getDate() && date_1.getMonth() === date_2.getMonth() && date_1.getFullYear() === date_2.getFullYear()
}

export function formatISODateString(date) {
    if (typeof date === 'string') {
        date = new Date(date).toISOString().slice(0, 10)
    }
    else if (typeof date === 'object') {
        return date.toISOString().slice(0, 10)
    }
}

export function changeStringToIsoDate(date) {
    const dateArr = date.split('/')
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
}