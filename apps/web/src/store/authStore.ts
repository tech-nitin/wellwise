import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  rigAssignment: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "usr_oil_01",
    name: "Nitin Rathore",
    email: "nitin.rathore@oilindia.in",
    role: "Senior Drilling Engineer",
    organization: "Oil India Limited (OIL)",
    rigAssignment: "RIG-OIL-04",
  },
  isAuthenticated: true,
  login: (email: string) =>
    set({
      isAuthenticated: true,
      user: {
        id: "usr_oil_01",
        name: email.split("@")[0],
        email,
        role: "Drilling Operations Engineer",
        organization: "Oil India Limited (OIL)",
        rigAssignment: "RIG-OIL-04",
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
