export interface UsuarioRequest {
    name: string;
    email: string;
    senha: string;
}

export interface UsuarioResponse {
    userId: number;
    nome: string;
    email: string;
    senha: string;
    dataCriacao?: string;
}
