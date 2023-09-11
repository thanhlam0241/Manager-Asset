export function getObjectIgnoreField(obj, ignoreFields) {
    const result = {}
    for (const key in obj) {
        if (!ignoreFields.includes(key)) {
            result[key] = obj[key]
        }
    }
    return result
}