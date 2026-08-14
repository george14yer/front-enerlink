import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject  } from 'rxjs';
import {ViviendaCreate_sin_id_usuario, ViviendaResponse, ViviendaUpdate} from '../interfaces/vivienda'
import { environment } from '../../../enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})

export class ViviendaService {

    private http = inject(HttpClient);


    // Evento que avisará cuando cambie la lista
    private actualizarViviendas = new Subject<void>();

    // Observable que escucharán los componentes
    actualizarViviendas$ = this.actualizarViviendas.asObservable();

    notificarActualizacion(): void {
        this.actualizarViviendas.next();
    }

    vivienda_create(data: ViviendaCreate_sin_id_usuario): Observable<ViviendaResponse> {
        return this.http.post<ViviendaResponse>(
            `${environment.apiUrl}/viviendas/_crear_vivienda_ath/`,
            data
        );
    };

    obtener_viviendas_por_usuario(): Observable<ViviendaResponse[]> {
        return this.http.get<ViviendaResponse[]>(
            `${environment.apiUrl}/viviendas/_mis_viviendas/`
        );
    };

    // vivienda-services.ts
    eliminar_vivienda(id_vivienda: number): Observable<{ mensaje: string }> {
        return this.http.delete<{ mensaje: string }>(
            `${environment.apiUrl}/viviendas/_eliminar_vivienda/${id_vivienda}`
        );
    }


    actualizar_vivienda(id_vivienda: number, data: ViviendaUpdate): Observable<ViviendaResponse>{
        return this.http.put<ViviendaResponse>(
            `${environment.apiUrl}/viviendas/actualizar_vivienda/${id_vivienda}`,
            data    
        )

    }


 }

