import { Component } from '@angular/core';
import {PRIMENG_MODULES} from '../../../layout/primeng/primeng';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';



@Component({
  selector: 'app-editar-gateway',
  imports: [...PRIMENG_MODULES],
  templateUrl: './editar-gateway.html'
 
})
export class EditarGateway {


  gatewayForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('El componente se inicializó');


    this.gatewayForm = this.fb.group({
      nombre_gateway: ['', Validators.required],
      direccion: ['', Validators.required],
      pais: [null, Validators.required],
      departamento: [null, Validators.required],
      ciudad: [null, Validators.required],
      estado: [true, Validators.required]
    });

  }

}
