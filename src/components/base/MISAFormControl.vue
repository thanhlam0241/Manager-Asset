<script setup>
/**
 * Props của form control
 * @type {Object}
 * @property {String} label - Nhãn của form control
 * @property {String} errorText - Nội dung lỗi của form control
 * @property {String} width - Chiều rộng của form control
 * @property {Boolean} required - Bắt buộc nhập
 * @property {String} defaultValue - Giá trị mặc định
 * @property {Boolean} disabled - Không cho phép nhập
 * @property {Boolean} error - Trạng thái lỗi
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  errorText: {
    type: String,
    default: 'Giá trị không hợp lệ'
  },
  width: {
    type: String,
    required: false
  },
  required: {
    type: Boolean,
    default: false
  },
  defaultValue: {
    type: [String, Number],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <label :style="{ width: props.width ? props.width + 'px' : '100%' }" class="form-control">
    <span v-if="props.label" :class="{ required: required }" class="label">{{ props.label }}</span>
    <slot />
    <span :class="['text-error', { show: error }]">{{ props.errorText }}</span>
  </label>
</template>

<style scoped>
.form-control {
  /* display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px; */
  display: flex;
  width: 100%;
  flex-direction: column;
}

.label {
  margin-bottom: 8px !important;
}

.text-error {
  margin-top: 4px;
}

.text-error {
  font-size: 12px;
  color: transparent;
  height: 10px;
}
.text-error.show {
  color: var(--color-error);
}
.required:after {
  content: '*';
  color: var(--color-error);
  margin-left: 1px;
}
::placeholder {
  color: #bdbdbd;
  font-style: italic;
  font-weight: 500;
}
</style>
