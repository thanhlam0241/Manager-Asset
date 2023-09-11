/*
    Chức năng: xóa dấu tiếng việt
    Tác giả: Nguyễn Thanh Lâm
    Ngày tạo: 21/7/2002
*/
function removeVietnameseDiacritics(str) {
    if (!str) return str;
    // Chuyển đổi các ký tự có dấu thành các ký tự không dấu
    let st1 = str.toString().toLowerCase()
        .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[iíìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/đ/g, 'd')
        //.replace(/\s*/g, '')
        ;

    // Thay thế các ký tự không hợp lệ với dấu cách
    //st1 = st1.replace(/[^a-z0-9]/g, '');
    return st1;
}

/**
 * Searches for a substring in a given string, ignoring Vietnamese diacritics and case sensitivity.
 * @param {string} str - The string to search in.
 * @param {string} searchStr - The substring to search for.
 * @returns {boolean} - True if the substring is found in the string, false otherwise.
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 21/7/2023
 */
function searchInString(str, searchStr) {
    if (!str) return false;
    if (!searchStr) return true;
    str = removeVietnameseDiacritics(str).toLowerCase();
    searchStr = removeVietnameseDiacritics(searchStr).toLowerCase();
    return str.includes(searchStr);
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

/**
 * Chức năng: format ngày tháng
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 21/7/2023
 */
function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-')
        // +
        // ' ' +
        // [
        //     padTo2Digits(date.getHours()),
        //     padTo2Digits(date.getMinutes()),
        //     padTo2Digits(date.getSeconds()),  //  can also add seconds
        // ].join(':')
    );
}

/**
 * Chức năng: format số tiền
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 21/7/2023
 */
function convertNumberToCurrency(number) {
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

/**
 * Chức năng: format số nguyên thành số có dấu chấm
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 21/7/2023
 */
function converStringToBigNumberString(stringA) {
    let string = stringA.toString();
    let value = '';
    let count = 0;
    if (string === null || string === undefined || string === '') {
        return '0';
    }
    if (string[0] === '-') {
        string = string.substring(1);
        for (let i = string.length - 1; i >= 1; i--) {
            value = string[i] + value;
            count++;
            if (count % 3 === 0 && i !== 0) {
                value = '.' + value;
            }
        }
        return '-' + value;
    }
    for (let i = string.length - 1; i >= 0; i--) {
        value = string[i] + value;
        count++;
        if (count % 3 === 0 && i !== 0) {
            value = '.' + value;
        }
    }
    return value;
}

/**
 * Chức năng: kiểm tra xem có phải là chuỗi số được format không
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 21/7/2023
 */
function checkIsNumberFormatString(value) {
    let regex = /^([1-9][0-9]{0,2})(\.[0-9][0-9][0-9])*$/;
    return regex.test(value);
}

/**
 * Chức năng: kiểm tra xem có phải là số không
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 21/7/2023
 * @param {*} value
 * @returns
 * true: là số
 * false: không phải là số
 * null: chuỗi rỗng
 * undefined: không phải là chuỗi
 * */
function checkIsNumberString(value) {
    let regex = /^[0-9]+$/;
    return regex.test(value);
}

function checkIsPositiveFloat(value) {
    let regex = /^[0-9]+(,[0-9]+)?$/;
    return regex.test(value);
}


/**
 * Converts a number string to a number.
 * @param {string} value - The number string to be converted.
 * @returns {number|undefined} - The converted number or undefined if the input is not a valid number string.
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 21/7/2023
 */
function convertNumberStringToNumber(value) {
    console.log(value)
    let isNumber = checkIsNumberFormatString(value)
    if (isNumber) {
        return Number(value.split('.').join(''));
    }
}

function compareDate(date1, date2) {
    let d1, d2
    if (date1 instanceof Date) {
        d1 = date1.toISOString().split('T')[0]
    }
    else {
        d1 = new Date(date1).toISOString().split('T')[0]
    }
    if (date2 instanceof Date) {
        d2 = date2.toISOString().split('T')[0]
    }
    else {
        d2 = new Date(date2).toISOString().split('T')[0]
    }
    return !d1 === d2
}
function isDateValid(dateStr) {
    return !isNaN(new Date(dateStr));
}
export {
    convertNumberToCurrency,
    converStringToBigNumberString,
    searchInString,
    removeVietnameseDiacritics,
    formatDate,
    checkIsNumberFormatString,
    checkIsNumberString,
    convertNumberStringToNumber,
    checkIsPositiveFloat,
    compareDate,
    isDateValid
};