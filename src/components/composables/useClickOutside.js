/**
 * Event that is triggered when a click occurs outside the combobox.
 * Created by: NTLam (2023-07-05).
 */
const useClickOutside = (document) => ({
    mounted: function (el, binding) {
        el.ClickOutsideHandler = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.body.addEventListener('click', el.ClickOutsideHandler)
    },
    unmounted: function (el) {
        document.body.removeEventListener('click', el.ClickOutsideHandler)
    }
})

export default useClickOutside;