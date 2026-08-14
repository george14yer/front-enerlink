export interface LoginRequest {
    correo: string;
    password: string;
}

export interface LoginResponse {
    mensaje: string;
    access_token: string;
    token_type: string;
}