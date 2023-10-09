export const textErrorAssetForm = {
    'VIETNAMESE': {
        'FIXED_ASSET_CODE': 'Mã tài sản không được để trống',
        'FIXED_ASSET_NAME': 'Tên tài sản không được để trống',
        'DEPARTMENT': 'Mã bộ phận không được để trống',
        'FIXED_ASSET_CATEGORY': 'Mã loại tài sản không được để trống',
        'QUANTITY': 'Số lượng phải là số nguyên dương',
        'COST': 'Nguyên giá phải là số nguyên dương',
        'LIFE_TIME': 'Số năm sử dụng phải là số nguyên dương',
        'PURCHASE_DATE': 'Ngày mua không được để trống',
        'DEPRECIATION_RATE': 'Tỷ lệ hao mòn phải là số không âm',
        'DATE_EXCEED': 'Ngày không được lớn hơn ngày hiện tại',
        'INVALID_YEAR': 'Năm theo dõi phải lớn hơn 2000',
    }
}

export const message = {
    'VIETNAMESE': {
        'DELETE': {
            'NO_SELECT': 'Chưa chọn tài sản để xóa',
            'SUCCESS': 'Xóa thành công',
            'FAIL': 'Xóa thất bại',
            'DELETE_ONE': function (code, name) {
                console.log(code, name)
                return `Bạn có muốn xóa tài sản <b>&lt;&lt;${code}  -  ${name}&gt;&gt;</b> không?`
            },
            'DELETE_MANY': function (count) {
                return `<b>${count}</b> tài sản đã được chọn. Bạn có muốn xóa các tài sản này khỏi danh sách?`
            },
            'CAN_NOT_DELETE_ONE': 'Không thể xóa tài sản này vì đã có chứng từ phát sinh',
            'CAN_NOT_DELETE_MANY': function (count) {
                return `<b>${count}</b> tài sản đã chọn không thể xóa. Vui lòng kiểm tra lại tài sản trước khi xóa`
            }
        },
        'UPDATE': {
            'NO_SELECT': 'Chưa chọn tài sản để cập nhật',
            'SUCCESS': 'Cập nhật thành công',
            'FAIL': 'Cập nhật thất bại',
            'NOT_VALID': 'Thông tin không hợp lệ',
        },
        'CLOSE': {
            'CANCEL_CREATE': 'Bạn có muốn hủy bỏ khai báo tài sản này?',
            'CANCEL_UPDATE': 'Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các thay đổi này',
        },
    }
}

export const table = {
    'VIETNAMESE': {
        'NO_DATA': 'Không có dữ liệu',
        'ADD_DATA': 'Thêm dữ liệu',
        'ALL': 'Tổng số',
        'ROW': 'bản ghi',
        'GO_TO_PAGE': 'Đi đến trang',
        'GO': 'Đến',
    }
}

export const excel = {
    'VIETNAMESE': {
        'FILE_COLUMN_NOT_VALID': 'File không hợp lệ: Tên các cột không đúng',
        'EMPTY_CELL': 'Dữ liệu các ô không được để trống',
        'DATE_FORMAT': 'Định dạng ngày không hợp lệ',
        'DUPLICATE_CODE': 'Mã tài sản không được trống hoặc trùng nhau',
        'NUMBER_FORMAT': 'Số lượng, nguyên giá, số năm sử dụng, năm theo dõi phải là số',
        'IMPORT_SUCCESS': 'Nhập dữ liệu thành công',
        'EXPORT_SUCCESS': 'Xuất dữ liệu thành công',
        'INSERT_AFTER': 'Thêm dòng vào sau',
        'INSERT_BEFORE': 'Thêm dòng vào trước',
        'INSERT_END': 'Thêm dòng vào cuối',
        'DELETE_ROW': 'Xóa dòng',
        'DELETE_ALL': 'Xóa tất cả',
        'DUPLICATE_ROW': 'Nhân bản dòng',
        'FILE_NOT_SUPPORT': 'File không hợp lệ. Chỉ chấp nhận file .xlsx',
        'IMPORT_DATA': 'Nhập dữ liệu',
        'EXPORT_DATA': 'Xuất dữ liệu',
        'CONDITION': 'File excel phải có định dạng như mẫu bên dưới',
        'FIXED_ASSET_CATEGORY': 'Loại tài sản',
        'DEPARTMENT': 'Bộ phận sử dụng',
    }
}

export const labelAsset = {
    'VIETNAMESE': {
        'FIXED_ASSET_CODE': 'Mã tài sản',
        'FIXED_ASSET_NAME': 'Tên tài sản',
        'RECORDED_ASSET_CODE': 'Mã tài sản',
        'RECORDED_ASSET_NAME': 'Tên tài sản',
        'DEPARTMENT_CODE': 'Mã bộ phận sử dụng',
        'DEPARTMENT_NAME': 'Tên bộ phận',
        'FIXED_ASSET_CATEGORY_CODE': 'Mã loại tài sản',
        'FIXED_ASSET_CATEGORY_NAME': 'Tên loại tài sản',
        'DESCRIPTION': 'Mô tả',
        'QUANTITY': 'Số lượng',
        'COST': 'Nguyên giá',
        'PURCHASE_DATE': 'Ngày mua',
        'LIFE_TIME': 'Số năm sử dụng',
        'DEPRECIATION_RATE': 'Tỷ lệ hao mòn (%)',
        'DEPRECIATION_VALUE': 'Giá trị hao mòn năm',
        'TRACKED_YEAR': 'Năm theo dõi',
        'PRODUCTION_DATE': 'Ngày bắt đầu sử dụng',
        'REMAINING_VALUE': 'Giá trị còn lại',
        'HMKH': 'HM/KH lũy kế',
        'FIXED_ASSET_CATEGORY': 'Loại tài sản',
        'DEPARTMENT': 'Bộ phận sử dụng',
    }
}

export const fieldList = {
    'FIXED_ASSET_CODE': 'fixedAssetCode',
    'FIXED_ASSET_NAME': 'fixedAssetName',
    'RECORDED_ASSET_CODE': 'recordedAssetCode',
    'RECORDED_ASSET_NAME': 'recordedAssetName',
    'VALUE': 'value',
    'DEPARTMENT_NAME': 'departmentName',
    'DEPARTMENT_CODE': 'departmentCode',
    'FIXED_ASSET_CATEGORY_CODE': 'fixedAssetCategoryCode',
    'FIXED_ASSET_CATEGORY_NAME': 'fixedAssetCategoryName',
    'DESCRIPTION': 'description',
    'QUANTITY': 'quantity',
    'COST': 'cost',
    'PURCHASE_DATE': 'purchaseDate',
    'LIFE_TIME': 'lifeTime',
    'DEPRECIATION_RATE': 'depreciationRate',
    'DEPRECIATION_VALUE_PER_YEAR': 'depreciationValuePerYear',
    'TRACKED_YEAR': 'trackedYear',
    'PRODUCTION_DATE': 'productionDate',
    'REMAINING_VALUE': 'remainingValue',
    'HMKH': 'hmkh',
}

export const contextMenu = {
    'VIETNAMESE': {
        'ADD': 'Thêm',
        'EDIT': 'Chỉnh sửa',
        'DELETE': 'Xóa',
        'DUPLICATE': 'Nhân bản',
        'UNSELECT_ALL': 'Bỏ chọn tất cả',
        'DETAIL': 'Chi tiết',
    }
}

export const contextMenuType = {
    'ADD': 'add',
    'EDIT': 'edit',
    'DELETE': 'delete',
    'DUPLICATE': 'duplicate',
    'UNSELECT_ALL': 'unSelectAll',
}