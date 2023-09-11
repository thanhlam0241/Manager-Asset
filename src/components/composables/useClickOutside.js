import { onMounted, onUnmounted } from 'vue';

export function useClickOutside(el_target_ref, callback_fn) {
    if (!el_target_ref.value) return;
    let listener = (e) => {
        if (e.target === el_target_ref || el_target_ref.contains(e.target)) {
            return;
        }

        if (callback_fn && typeof callback_fn === 'function') {
            callback_fn();
        }
    }

    onMounted(() => {
        document.addEventListener('click', listener);
    })
    onUnmounted(() => {
        document.removeEventListener('click', listener);
    })
    return listener
}