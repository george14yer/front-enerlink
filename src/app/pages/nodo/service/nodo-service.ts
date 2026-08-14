import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject  } from 'rxjs';
import { NodoResponse } from '../interfaces/nodo'
import { environment } from '../../../enviroments/enviroment';
import { ConsumoResponse, ConsumoSemanalResponse } from '../interfaces/nodo';
import { ConsumoGatewayResponse } from '../../gateway/interfaces/mediciones-gateway';

@Injectable({
  providedIn: 'root'
})
export class NodoService{
    private http = inject(HttpClient);


    // Evento que avisará cuando cambie la lista
    private actualizarNodos = new Subject<void>();

    // Observable que escucharán los componentes
    actualizarNodos$ = this.actualizarNodos.asObservable();

    notificarActualizacion(): void {
        this.actualizarNodos.next();
    }


    obtener_nodo_por_id_gateway(id_gateway: number): Observable<NodoResponse[]> {

        return this.http.get<NodoResponse[]>(
            `${environment.apiUrl}/nodos/_por_gateway/${id_gateway}`
        );
    };

    eliminar_nodo(id_nodo:number): Observable<{ mensaje: string }>{
        return this.http.delete<{ mensaje: string }>(
            `${environment.apiUrl}/nodos/_eliminar_nodo/${id_nodo}`
        )
    }



    ////////////////////////////////MEDICIONES///////////////////////////////////////////////////////
    obtener_consumo_diario(id_nodo: number): Observable<ConsumoResponse> {
        return this.http.get<ConsumoResponse>(
        `${environment.apiUrl}/mediciones/_consumo_diario/${id_nodo}`
        );
    }

    obtener_consumo_mensual(id_nodo: number): Observable<ConsumoResponse> {
        return this.http.get<ConsumoResponse>(
        `${environment.apiUrl}/mediciones/_consumo_mensual/${id_nodo}`
        );
    }

    obtener_consumo_semanal(id_nodo: number): Observable<ConsumoSemanalResponse> {
        return this.http.get<ConsumoSemanalResponse>(
        `${environment.apiUrl}/mediciones/_consumo_semanal/${id_nodo}`
        );
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




}
