import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject  } from 'rxjs';
import { GatewayResponse, GatewayUpdate } from '../interfaces/gateway'
import { environment } from '../../../enviroments/enviroment';
import {
  ConsumoGatewayResponse,
  ConsumoSemanalGatewayResponse,
  ConsumoTotalResponse,
  ConsumoSemanalTotalResponse,
  ConsumoAnualTotalResponse
} from '../interfaces/mediciones-gateway';


@Injectable({
  providedIn: 'root'
})

export class GatewayService{
    private http = inject(HttpClient);


    // Evento que avisará cuando cambie la lista
    private actualizarGateway = new Subject<void>();

    // Observable que escucharán los componentes
    actualizarGateway$ = this.actualizarGateway.asObservable();

    notificarActualizacion(): void {
        this.actualizarGateway.next();
    }


    //MOSTRAR GATEWAYS DE UNA VIVIENDA ESPECIFICA DEL USUARIO AUTENTICADO
    obtener_gateways_por_id_vivienda(id_vivienda: number): Observable<GatewayResponse[]> {
            return this.http.get<GatewayResponse[]>(
                `${environment.apiUrl}/gateways/_por_vivienda/${id_vivienda}`
            );
        };



    //mostrar todos los gateways que tiene un usuario
    obtener_all_gateways(): Observable<GatewayResponse[]> {
            return this.http.get<GatewayResponse[]>(
                `${environment.apiUrl}/gateways/_mis_gateway/`
            );
        };
   


    

    eliminar_gateway(id_gateway:number): Observable<{ mensaje: string }>{
        return this.http.delete<{ mensaje: string }>(
            `${environment.apiUrl}/gateways/_eliminar_gateway/${id_gateway}`
        )
    }

    obtenerConsumoDiarioGateway(id_gateway: number): Observable<ConsumoGatewayResponse> {
        return this.http.get<ConsumoGatewayResponse>(
            `${environment.apiUrl}/mediciones_gateway/_consumo_diario/${id_gateway}`
        );
    }

    obtenerConsumoMensualGateway(id_gateway: number): Observable<ConsumoGatewayResponse> {
        return this.http.get<ConsumoGatewayResponse>(
            `${environment.apiUrl}/mediciones_gateway/_consumo_mensual/${id_gateway}`
        );
    }

    obtenerConsumoSemanalGateway(id_gateway: number): Observable<ConsumoSemanalGatewayResponse> {
        return this.http.get<ConsumoSemanalGatewayResponse>(
            `${environment.apiUrl}/mediciones_gateway/_consumo_semanal/${id_gateway}`
        );
    }

    obtenerConsumoDiarioTotal(): Observable<ConsumoTotalResponse> {
        return this.http.get<ConsumoTotalResponse>(
            `${environment.apiUrl}/mediciones_gateway/_consumo_diario_total/`
        );
    }

    obtenerConsumoMensualTotal(): Observable<ConsumoTotalResponse> {
        return this.http.get<ConsumoTotalResponse>(
            `${environment.apiUrl}/mediciones_gateway/_consumo_mensual_total/`
        );
    }

    obtenerConsumoSemanalTotal(): Observable<ConsumoSemanalTotalResponse> {
        return this.http.get<ConsumoSemanalTotalResponse>(
            `${environment.apiUrl}/mediciones_gateway/_consumo_semanal_total/`
        );
    }

    obtenerConsumoAnualTotal(): Observable<ConsumoAnualTotalResponse> {
        return this.http.get<ConsumoAnualTotalResponse>(
            `${environment.apiUrl}/mediciones_gateway/_consumo_anual_total/`
        );
    }

}
