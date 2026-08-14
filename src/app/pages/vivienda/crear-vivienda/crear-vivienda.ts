import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import {PRIMENG_MODULES} from '../../../layout/primeng/primeng';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { COLOMBIA } from '../../../../app/shared/ubicaciones';
import {FormularioVivienda} from '../formulario-vivienda/formulario-vivienda';
import {ViviendaService} from '../services/vivienda-services'
import { Injectable, inject } from '@angular/core';


@Component({
  selector: 'app-crear-vivienda',
  standalone: true,
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, FormularioVivienda],
  templateUrl: './crear-vivienda.html',
  
  

})
export class CrearVivienda implements OnInit {


  private viviendaService = inject(ViviendaService);

  //Recibe una variable que indique si el modal está abierto.
  @Input() visible = false;
  
  @Output() visibleChange = new EventEmitter<boolean>();

  isSaving = false; //para bloquear el boton de crear
   @ViewChild(FormularioVivienda)
   formularioVivienda!: FormularioVivienda;
  
  
  crear(data: any) {
     if (this.isSaving) return;
     this.isSaving = true;

    //Antes de llamar al servicio, transforma los datos.
    const vivienda = {
      nombre: data.nombre,
      direccion: data.direccion,
      pais: data.pais.nombre,
      departamento: data.departamento.nombre,
      ciudad: data.ciudad.nombre,
      estado: data.estado
    };  
    
    console.log(vivienda);
    console.log(data);

    this.viviendaService.vivienda_create(vivienda).subscribe({
      next: () => {
        this.formularioVivienda.limpiarFormulario();
        this.viviendaService.notificarActualizacion(); //notifica que fue agregada una vivienda a la tabla para que actualice
        this.visibleChange.emit(false);// cierra modal luego de crear
        this.isSaving = false;
        
      }, 
      error: (error) => {
          console.error(error);
          this.isSaving = false;
      }
    });
  }

ngOnInit(): void {
  // Aquí cargarías los datos de la API
  // this.obtenerTiposVivienda();
}


alCerrarModal(): void {
  this.formularioVivienda?.limpiarFormulario();
  this.visibleChange.emit(false);
}

}

