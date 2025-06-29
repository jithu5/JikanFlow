import {create} from "zustand";

interface UserState {
    token: string;
    setToken: (token: string) => void;
}

const useUserStore = create<UserState>((set) => ({
    token: '',
    setToken: (token: string) => set({ token }),
}));
export default useUserStore;