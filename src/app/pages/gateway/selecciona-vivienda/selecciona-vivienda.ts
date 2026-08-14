import { Component, OnInit, inject, signal, EventEmitter, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../../../layout/primeng/primeng';
import { ViviendaResponse } from '../../vivienda/interfaces/vivienda';
import { ViviendaService } from '../../vivienda/services/vivienda-services';

@Component({
  selector: 'app-selecciona-vivienda',
  imports: [...PRIMENG_MODULES],
  templateUrl: './selecciona-vivienda.html'
  
})
export class SeleccionaVivienda implements OnInit {
  private viviendaService = inject(ViviendaService);
  viviendas = signal<ViviendaResponse[]>([]);
  @Output() viviendaSeleccionada = new EventEmitter<ViviendaResponse>();



  ngOnInit(): void {
    this.viviendaService.obtener_viviendas_por_usuario().subscribe({
      next: (viviendas) => this.viviendas.set(viviendas),
      error: (error) => console.error(error)
    });
  }

  seleccionar(vivienda: ViviendaResponse): void {
    this.viviendaSeleccionada.emit(vivienda);
  }
 
}
