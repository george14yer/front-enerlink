import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import {PRIMENG_MODULES} from '../../../layout/primeng/primeng';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { COLOMBIA } from '../../../../app/shared/ubicaciones';
import {FormularioVivienda} from '../formulario-vivienda/formulario-vivienda';
import {ViviendaService} from '../services/vivienda-services'
import { Injectable, inject } from '@angular/core';
import { ViviendaResponse,  } from '../interfaces/vivienda';


@Component({
  selector: 'app-editar-vivienda',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, FormularioVivienda],
  templateUrl: './editar-vivienda.html',

})
export class EditarVivienda implements OnInit  {

  private viviendaService = inject(ViviendaService);

  @Input() visible = false;
  @Input() vivienda: ViviendaResponse | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  isSaving = false;
  ngOnInit(): void {
  // Aquí cargarías los datos de la API
  // this.obtenerTiposVivienda();
  }

  editar(data: any): void{
    if(!this.vivienda || this.isSaving) return;
    this.isSaving = true;
    const viviendaActualizada = {
      nombre: data.nombre,
      direccion: data.direccion,
      pais: data.pais.nombre,
      departamento: data.departamento.nombre,
      ciudad: data.ciudad.nombre,
      estado: data.estado
    };

    this.viviendaService.actualizar_vivienda(this.vivienda.id_vivienda, viviendaActualizada)
    .subscribe({
      next: () => {
        this.viviendaService.notificarActualizacion();
        this.visibleChange.emit(false);
        this.isSaving = false;
      },
      error: (error) => {
        console.error('No se pudo actualizar la vivienda:', error);
        this.isSaving = false;
      }
    });
  }



  alCerrarModal(): void {
  this.visibleChange.emit(false);
  }
}
