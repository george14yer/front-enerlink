export interface ConsumoGatewayResponse {
  id_gateway: number;
  consumo_total_kwh: number;
  periodo_inicio: string;
  periodo_fin: string;
}

export interface ConsumoPorDiaGateway {
  fecha: string;
  consumo_kwh: number;
}

export interface ConsumoSemanalGatewayResponse {
  id_gateway: number;
  periodo_inicio: string;
  periodo_fin: string;
  datos: ConsumoPorDiaGateway[];
}

export interface ConsumoTotalResponse {
  id_usuario: number;
  consumo_total_kwh: number;
  periodo_inicio: string;
  periodo_fin: string;
  gateways_incluidos: number;
}

export interface ConsumoPorDiaTotal {
  fecha: string;
  consumo_kwh: number;
}

export interface ConsumoSemanalTotalResponse {
  id_usuario: number;
  periodo_inicio: string;
  periodo_fin: string;
  datos: ConsumoPorDiaTotal[];
}

export interface ConsumoPorMes {
  anio: number;
  mes: number;
  consumo_kwh: number;
}

export interface ConsumoAnualTotalResponse {
  id_usuario: number;
  periodo_inicio: string;
  periodo_fin: string;
  datos: ConsumoPorMes[];
}
