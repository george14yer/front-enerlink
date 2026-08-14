import { Component, OnInit, inject, signal, EventEmitter, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../../../layout/primeng/primeng';
import { GatewayResponse } from '../../gateway/interfaces/gateway';
import { GatewayService } from '../../gateway/services/gateway-services';

@Component({
  selector: 'app-selecciona-gateway',
  imports: [...PRIMENG_MODULES],
  templateUrl: './selecciona-gateway.html'
  
})
export class SeleccionaGateway  implements OnInit{
    private gatewayService = inject(GatewayService);
    gateways = signal<GatewayResponse[]>([]);
    @Output() gatewaySeleccionado = new EventEmitter<GatewayResponse>();



    ngOnInit(): void {
      this.gatewayService.obtener_all_gateways().subscribe({
        next: (gateways) => this.gateways.set(gateways),
        error: (error) => console.error(error)
      });
    }

    seleccionar(gateway: GatewayResponse): void {
        this.gatewaySeleccionado.emit(gateway);
      }

}
