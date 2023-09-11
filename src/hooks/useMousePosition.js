import { ref } from 'vue'

export default function () {
    const yMousePosition = ref(0)
    const xMousePosition = ref(0)

    const isOpenOption = ref(false)

    const toggle = (e) => {
        yMousePosition.value = e.clientY + 10
        isOpenOption.value = !isOpenOption.value
    }

    const close = () => {
        isOpenOption.value = false
    }

    return {
        yMousePosition,
        xMousePosition,
        isOpenOption,
        toggle,
        close
    }
}