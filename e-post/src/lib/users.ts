const USER = "appUser";

type User = {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: "admin" | "staff" | "customer";
  };

export const setUser = (user: User | null) => {
    localStorage.setItem(USER, JSON.stringify(user));
};

export const getUser = () => {
    const stored = localStorage.getItem(USER);
    return stored ? JSON.parse(stored) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER);
};
