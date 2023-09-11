/**
 * Event that is triggered when a click occurs outside the combobox.
 * Created by: NTLam (2021-07-05).
 */
export const vClickOutside = {
    mounted: function (el, binding) {
        el.ClickOutsideHandler = function (event) {
            if (
                !(
                    el == event.target ||
                    el.contains(event.target) ||
                    event.target.className === 'select2-selection__choice__remove' ||
                    event.target.className === 'select2-search__field'
                )
            ) {
                binding.value(event)
            }
        }
        document.body.addEventListener('click', el.ClickOutsideHandler)
    },
    unmounted: function (el) {
        document.body.removeEventListener('click', el.ClickOutsideHandler)
    }
}