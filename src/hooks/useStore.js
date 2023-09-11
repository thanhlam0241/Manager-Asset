import { useStore } from "vuex";

export default function useStoreHook() {
    const store = useStore();
    return {
        store
    };
}