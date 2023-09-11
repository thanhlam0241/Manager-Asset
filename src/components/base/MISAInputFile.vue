<script setup>
import { ref } from 'vue'

/**
 * MISACheckbox component props
 * @props {string} name - The name of the checkbox
 * @props {boolean} disabled - Determines whether the checkbox is disabled or not
 * @props {boolean} value - The value of the checkbox
 * @props {Object} inputRef - The ref of the checkbox
 * Creatd by: NTLam (20/07/2023)
 */
const props = defineProps({
  accept: {
    type: String,
    default: 'image/*'
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

/**
 * A reactive variable that represents the checked state of the checkbox.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const emit = defineEmits(['getFile'])

/**
 * Expose method focus
 * Created by: NTLam (20/07/2023)
 */
const dropContainer = ref(null)

/**
 * Expose method focus
 * Created by: NTLam (20/07/2023)
 */
const inputFile = ref(null)

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (20/07/2023)
 */
const onDrop = (e) => {
  e.preventDefault()
  dropContainer.value.classList.remove('drag-active')
  inputFile.value.files = e.dataTransfer.files
  inputFile.value.dispatchEvent(new Event('change'))
}

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (20/07/2023)
 */
const onDragLeave = () => {
  dropContainer.value.classList.remove('drag-active')
}

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (20/07/2023)
 */
const onDragOver = (e) => {
  e.preventDefault()
  dropContainer.value.classList.add('drag-active')
}

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (20/07/2023)
 */
const onDragEnter = () => {
  dropContainer.value.classList.add('drag-active')
}

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (20/07/2023)
 */
const onChange = (e) => {
  console.log(e.target.files[0])
  emit('getFile', e.target.files[0])
  inputFile.value.value = ''
}
</script>

<template>
  <label
    @drop="onDrop"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @dragenter="onDragEnter"
    ref="dropContainer"
    for="input-file"
    class="drop-container"
    id="dropcontainer"
  >
    <span class="drop-title">Thả file tại đây</span>
    hoặc
    <input
      @change="onChange"
      ref="inputFile"
      :multiple="props.multiple"
      :accept="props.accept"
      type="file"
      id="input-file"
      required
    />
  </label>
</template>

<style scoped>
input[type='file'] {
  width: 350px;
  max-width: 100%;
  color: #444;
  padding: 5px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #555;
}

input[type='file']::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #084cdf;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type='file']::file-selector-button:hover {
  background: #0d45a5;
}
.drop-container {
  position: relative;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 400px;
  padding: 0px;
  border-radius: 10px;
  border: 1px dashed #555;
  color: #444;
  cursor: pointer;
  transition:
    background 0.2s ease-in-out,
    border 0.2s ease-in-out;
}

.drop-container:hover {
  background: #eee;
  border-color: #111;
}

.drop-container:hover .drop-title {
  color: #222;
}

.drop-title {
  color: #444;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  transition: color 0.2s ease-in-out;
}

.drop-container.drag-active {
  background: #eee;
  border-color: #111;
}

.drop-container.drag-active .drop-title {
  color: #222;
}
</style>
