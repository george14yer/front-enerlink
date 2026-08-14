export interface ViviendaCreate_sin_id_usuario {
    nombre: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
    estado: boolean;
}

export interface ViviendaResponse {
    id_usuario: number;
    id_vivienda: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    departamento: string;     
    pais: string;   
    fecha_creacion: string;   
    estado: boolean;
}

export interface ViviendaUpdate {
    nombre: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
    estado: boolean;
}
