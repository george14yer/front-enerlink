export interface NodoResponse {   
    id_nodo: number;
    id_gateway: number;
    id_tipo_nodo: number;
    uuid_nodo: string;
    mac_address: string;
    nombre_nodo: string;
    ubicacion: string;
    fecha_asociacion:  string;
    estado:  Boolean;
}




////////////////////////MEDICIONES//////////////////////
export interface ConsumoResponse {
  id_nodo: number;
  consumo_total_kwh: number;
  periodo_inicio: string;
  periodo_fin: string;
}

export interface ConsumoPorDia {
  fecha: string;
  consumo_kwh: number;
}

export interface ConsumoSemanalResponse {
  id_nodo: number;
  periodo_inicio: string;
  periodo_fin: string;
  datos: ConsumoPorDia[];
}