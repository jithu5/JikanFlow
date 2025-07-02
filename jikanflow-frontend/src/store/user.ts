import { create } from "zustand";

interface IUser {
    username: string;
    email: string;
}

interface IUserStore {
    user: IUser;
    setUser: (user: IUser) => void;
    removeUser: () => void;
}

const useUserStore = create<IUserStore>((set) => ({
    user: {
        username: "",
        email: "",
    },
    setUser: (user: IUser) => set({ user }),
    removeUser: () =>
        set({
            user: {
                username: "",
                email: "",
            },
        }),
}));

export default useUserStore;
