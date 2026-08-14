import { afterNextRender, Component, OnInit, inject, signal, DestroyRef, Output, EventEmitter } from '@angular/core';
import {Table} from '../../../shared/table/table'
import { ViviendaService } from '../services/vivienda-services'
import {TableColumn} from '../../../shared/table/interface_table'
import { ViviendaResponse } from '../interfaces/vivienda';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {PRIMENG_MODULES} from '../../../layout/primeng/primeng';
import { ConfirmationService, MessageService  } from 'primeng/api';

@Component({
  selector: 'app-ver-vivienda',
  standalone: true,
  imports: [...PRIMENG_MODULES, Table  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './ver-vivienda.html',
 
})
export class VerVivienda {
    
    private viviendaService = inject(ViviendaService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);
    viviendas= signal<ViviendaResponse[]> ([]);
    @Output() editarVivienda = new EventEmitter<ViviendaResponse>();
    
    
    columns: TableColumn[] = [
        {field: 'nombre', header: 'Nombre'},
        {field: 'direccion', header: 'Dirección'},
        {field: 'pais', header: 'País'},
        {field: 'departamento', header: 'Departamento'},
        {field: 'ciudad',header: 'Ciudad'},
        {field: 'estado', header: 'Estado', type: 'boolean'},
        {field: 'fecha_creacion', header: 'Fecha de creación', type: 'date', format: 'dd/MM/yyyy'}
    ];


    ngOnInit(): void {
    this.obtenerViviendas();
    this.viviendaService.actualizarViviendas$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => 
        this.obtenerViviendas());
  }

    


    obtenerViviendas(): void{
        this.viviendaService.obtener_viviendas_por_usuario()
      .subscribe({
        next: (response) => {
          this.viviendas.set(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }

    onAction(event: any): void {
        switch (event.action){
            case 'Editar':
                this.editar(event.data);
                break;
                
            case 'Eliminar':
                this.eliminar(event.data);
                break;
        }
    }


    editar(vivienda: ViviendaResponse): void {
        console.log('Editar', vivienda);
        this.editarVivienda.emit(vivienda);
        // Aquí luego navegarás al formulario de edición
    }

    eliminar(vivienda: ViviendaResponse): void {
      this.confirmationService.confirm({
        message: `¿Deseas eliminar la vivienda "${vivienda.nombre}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',

        accept: () => {
          this.viviendaService.eliminar_vivienda(vivienda.id_vivienda)
            .subscribe({
              next: () => {
                this.viviendaService.notificarActualizacion();
              },
              error: (error) => {
                if (error.status === 409) {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'No se puede eliminar',
                    detail: error.error.detail,
                    life: 5000
                  });

                  return;
                }

                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No fue posible eliminar la vivienda.',
                  life: 4000
                });
              }
            });
        }
      });
    }
}

    



        

        




