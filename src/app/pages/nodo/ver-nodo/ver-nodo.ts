import { Component, Input, inject  } from '@angular/core';
import {PRIMENG_MODULES} from '../../../layout/primeng/primeng';
import { DatePipe,TitleCasePipe, UpperCasePipe  } from '@angular/common';
import { NodoResponse } from '../interfaces/nodo';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { NodoService } from '../service/nodo-service';
import { DetalleNodo } from '../detalle-nodo/detalle-nodo';



@Component({
  selector: 'app-ver-nodo',
  imports: [...PRIMENG_MODULES, DatePipe, DetalleNodo],
  templateUrl: './ver-nodo.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './ver-nodo.scss',
})
export class VerNodo {
  private confirmationService = inject(ConfirmationService);
  private nodoService = inject(NodoService);
  private messageService = inject(MessageService);

  @Input() dataSource: NodoResponse[] = [];
  @Input() hayGateway = false;
  mostrarDetalle = false;
  nodoSeleccionado: NodoResponse | null = null;

  editar(item: any): void {
    console.log('Editar nodo:', item);
  }

   eliminar(nodo: NodoResponse): void {
    this.confirmationService.confirm({
      message: `¿Deseas eliminar el gateway "${nodo.nombre_nodo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.nodoService.eliminar_nodo(nodo.id_nodo)
          .subscribe({
            next: () => {
              this.nodoService.notificarActualizacion();
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
                  detail: 'No fue posible eliminar el nodo.',
                  life: 4000
                });
            }           
          });
      }
    });

   }
   abrirGrafico(nodo: NodoResponse): void {
    this.nodoSeleccionado = nodo;
    this.mostrarDetalle = true;
  }
}
