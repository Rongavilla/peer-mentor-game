export interface User {
    id: string;
    username: string;
    role: 'mentor' | 'student' | 'admin';
}

export interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}