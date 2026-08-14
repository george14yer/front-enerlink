import { Component, OnInit, signal, ViewChild, Input, Output, EventEmitter,SimpleChanges, OnChanges  } from '@angular/core';
import {PRIMENG_MODULES} from '../../../layout/primeng/primeng';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { COLOMBIA } from '../../../../app/shared/ubicaciones';


@Component({
  selector: 'app-formulario-vivienda',
  standalone: true,
  imports: [...PRIMENG_MODULES, ReactiveFormsModule],
  templateUrl: './formulario-vivienda.html',
})
export class FormularioVivienda implements OnInit, OnChanges {

  @Input() vivienda: any = null;
  @Output() guardar = new EventEmitter<any>();
  @Input() isLoading = false;
  

  constructor(private fb: FormBuilder) {}
  viviendaForm!: FormGroup;
  paises = COLOMBIA;
  departamentos: any[] = [];
  ciudades: any[] = [];

  ngOnInit(): void {
    console.log('El componente se inicializó');

    // Aquí cargarías los datos de la API
    // this.obtenerTiposVivienda();

    this.viviendaForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      pais: [null, Validators.required],
      departamento: [null, Validators.required],
      ciudad: [null, Validators.required],
      estado: [true, Validators.required]
    });

    this.viviendaForm.get('pais')?.valueChanges.subscribe(pais => {
      this.departamentos = pais?.departamentos ?? [];
      this.ciudades = [];
      this.viviendaForm.patchValue({
          departamento: null,
          ciudad: null
      });
    });

    this.viviendaForm.get('departamento')?.valueChanges.subscribe(departamento => {
      this.ciudades = departamento?.ciudades ?? [];
      this.viviendaForm.patchValue({
          ciudad: null
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (!changes['vivienda'] || !this.vivienda || !this.viviendaForm) {
    return;
  }

  const pais = this.paises.find(
    (item: any) => item.nombre === this.vivienda.pais
  );

  this.departamentos = pais?.departamentos ?? [];

  const departamento = this.departamentos.find(
    (item: any) => item.nombre === this.vivienda.departamento
  );

  this.ciudades = departamento?.ciudades ?? [];

  const ciudad = this.ciudades.find(
    (item: any) => item.nombre === this.vivienda.ciudad
  );

  this.viviendaForm.patchValue(
    {
      nombre: this.vivienda.nombre,
      direccion: this.vivienda.direccion,
      pais,
      departamento,
      ciudad,
      estado: this.vivienda.estado
    },
    { emitEvent: false }
  );
  } 

  limpiarFormulario(): void {
    this.viviendaForm.reset(
      {
        nombre: '',
        direccion: '',
        pais: null,
        departamento: null,
        ciudad: null,
        estado: true
      },
      { emitEvent: false }

    );
    this.departamentos = [];
    this.ciudades = [];
    this.viviendaForm.markAsPristine();
    this.viviendaForm.markAsUntouched();


  }






  
  /*guardarFormulario() {

      console.log(this.viviendaForm.value);
      console.log(this.viviendaForm.valid);
      console.log(this.viviendaForm.errors);

      if (this.viviendaForm.invalid) {
        this.viviendaForm.markAllAsTouched();
        console.log('a')
        return;
      }
      this.guardar.emit(this.viviendaForm.value);
      console.log('b')
    }*/

    guardarFormulario() {

      Object.keys(this.viviendaForm.controls).forEach(control => {
        const c = this.viviendaForm.get(control);

        console.log({
          control,
          value: c?.value,
          valid: c?.valid,
          errors: c?.errors
        });
      });

      console.log('Formulario válido:', this.viviendaForm.value);

      if (this.viviendaForm.invalid) {
        this.viviendaForm.markAllAsTouched();
        return;
      }

      this.guardar.emit(this.viviendaForm.value);
    }


}

