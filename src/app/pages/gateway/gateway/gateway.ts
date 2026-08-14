import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { SeleccionaVivienda } from '../selecciona-vivienda/selecciona-vivienda';
import { GatewayService } from '../services/gateway-services';
import { GatewayResponse } from '../interfaces/gateway';
import { ViviendaResponse } from '../../vivienda/interfaces/vivienda';
import { VerGateway } from '../ver-gateway/ver-gateway';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-gateway',
  imports: [SeleccionaVivienda, VerGateway, DecimalPipe],
  templateUrl: './gateway.html',
  styleUrl: './gateway.scss'
 
})
export class Gateway implements OnInit, OnDestroy{

  private gatewayService = inject(GatewayService);
  gateways = signal<GatewayResponse[]>([]);

  viviendaSeleccionada: ViviendaResponse | null = null;
  consumoDiarioVivienda = signal(0);
  consumoMensualVivienda = signal(0);
  cargandoConsumo = signal(false);
  private actualizacion?: Subscription;

  //permite traer las viviendas para poder seleccionar cuales gateways de x vivienda van a salir
  cargarGateways(vivienda: ViviendaResponse): void {
    this.viviendaSeleccionada = vivienda;
    this.gatewayService
      .obtener_gateways_por_id_vivienda(vivienda.id_vivienda)
      .subscribe({
        next: (gateways) => {
          this.gateways.set(gateways);
          this.cargarConsumoVivienda(gateways);
        },
        error: (error) => {
          console.error(error);
          this.gateways.set([]);
        }
      });
  }

  ngOnInit(): void {
  this.actualizacion = this.gatewayService.actualizarGateway$.subscribe(() => {
    if (this.viviendaSeleccionada) {
      this.cargarGateways(this.viviendaSeleccionada);
    }
  });
}

  ngOnDestroy(): void {
    this.actualizacion?.unsubscribe();
  }

  private cargarConsumoVivienda(gateways: GatewayResponse[]): void {
    if (gateways.length === 0) {
      this.consumoDiarioVivienda.set(0);
      this.consumoMensualVivienda.set(0);
      this.cargandoConsumo.set(false);
      return;
    }

    this.cargandoConsumo.set(true);
    forkJoin({
      diario: forkJoin(gateways.map(gateway => this.gatewayService.obtenerConsumoDiarioGateway(gateway.id_gateway))),
      mensual: forkJoin(gateways.map(gateway => this.gatewayService.obtenerConsumoMensualGateway(gateway.id_gateway)))
    }).subscribe({
      next: ({ diario, mensual }) => {
        this.consumoDiarioVivienda.set(diario.reduce((total, dato) => total + dato.consumo_total_kwh, 0));
        this.consumoMensualVivienda.set(mensual.reduce((total, dato) => total + dato.consumo_total_kwh, 0));
        this.cargandoConsumo.set(false);
      },
      error: (error) => {
        console.error('No se pudo cargar el consumo de la vivienda.', error);
        this.cargandoConsumo.set(false);
      }
    });
  }

}
