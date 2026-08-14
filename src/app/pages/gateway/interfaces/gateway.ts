export interface GatewayResponse {
    id_gateway: number;  
    id_vivienda: number;
    uuid_gateway: string;
    nombre_gateway: string;
    fecha_instalacion: string;
    estado: Boolean;
}
    
export interface GatewayUpdate {
    id_vivienda: number;
    uuid_gateway: string;
    nombre_gatew: string;
    estado: Boolean;
}
