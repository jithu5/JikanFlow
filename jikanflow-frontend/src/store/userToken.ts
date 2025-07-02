import {create} from "zustand";

interface UserTokenState {
    token: string;
    setToken: (token: string) => void;
}

const useUserTokenStore = create<UserTokenState>((set) => ({
    token: '',
    setToken: (token: string) => set({ token }),
}));
export default useUserTokenStore;