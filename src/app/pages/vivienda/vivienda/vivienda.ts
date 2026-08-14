import { Component, EventEmitter, Output } from '@angular/core';
import { CrearVivienda } from '../crear-vivienda/crear-vivienda';
import {VerVivienda} from '../ver-vivienda/ver-vivienda'
import {Toolbar} from '../../../shared/toolbar/toolbar'
import { ViviendaResponse } from '../interfaces/vivienda';
import { EditarVivienda } from '../editar-vivienda/editar-vivienda';

@Component({
  selector: 'app-vivienda',
  standalone: true,
  imports: [CrearVivienda, VerVivienda,EditarVivienda, Toolbar],
  templateUrl: './vivienda.html',
  
})
export class Vivienda {
  mostrarModal = false;

  onToolbarAction(event: { action: string }): void {
    if (event.action === 'Nuevo') {
      this.mostrarModal = true;
    }
  }


  viviendaSeleccionada: ViviendaResponse | null = null;
  mostrarEditar = false;
  editar(vivienda: ViviendaResponse): void {
    this.viviendaSeleccionada = vivienda;
    this.mostrarEditar = true;
  }

    
  

}
