export interface AuthUserPayload {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export interface AuthSessionRemote {
    token: string;
    user: AuthUserPayload;
    expiresAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    senha?: string;
}
