import { Component, Input, inject  } from '@angular/core';
import {PRIMENG_MODULES} from '../../../layout/primeng/primeng';
import { DatePipe,TitleCasePipe, UpperCasePipe  } from '@angular/common';
import { GatewayResponse } from '../interfaces/gateway'
import { ConfirmationService, MessageService  } from 'primeng/api';
import { GatewayService } from '../services/gateway-services';
import { DetalleGateway } from '../detalle-gateway/detalle-gateway';

@Component({
  selector: 'app-ver-gateway',
  imports: [...PRIMENG_MODULES, DatePipe, DetalleGateway],
  templateUrl: './ver-gateway.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './ver-gateway.scss',
})
export class VerGateway {
  private confirmationService = inject(ConfirmationService);
  private gatewayService = inject(GatewayService);
  private messageService = inject(MessageService);

  @Input() dataSource: any[] = [];
  @Input() hayVivienda = false;
  mostrarDetalle = false;
  gatewaySeleccionado: GatewayResponse | null = null;



  editar(item: any): void {
    console.log('Editar gateway:', item);
  }

  eliminar(gateway: GatewayResponse): void {
    this.confirmationService.confirm({
      message: `¿Deseas eliminar el gateway "${gateway.nombre_gateway}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
          this.gatewayService.eliminar_gateway(gateway.id_gateway)
            .subscribe({
              next: () => {
                this.gatewayService.notificarActualizacion();
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
                  detail: 'No fue posible eliminar el gateway.',
                  life: 4000
                });
              }

            });
        }
      });
  }
 

    
  abrirGrafico(item: any): void {
    this.gatewaySeleccionado = item;
    this.mostrarDetalle = true;
  }


}
