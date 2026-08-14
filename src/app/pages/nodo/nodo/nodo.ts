import { Component, inject, signal, OnInit, OnDestroy} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { SeleccionaGateway } from '../selecciona-gateway/selecciona-gateway';
import { NodoResponse } from '../interfaces/nodo';
import { NodoService } from '../service/nodo-service';
import { GatewayResponse } from '../../gateway/interfaces/gateway';
import { VerNodo } from '../ver-nodo/ver-nodo';


@Component({
  selector: 'app-nodo',
  imports: [SeleccionaGateway, VerNodo, DecimalPipe],
  templateUrl: './nodo.html',
  styleUrl: './nodo.scss'
})
export class Nodo implements OnInit, OnDestroy {

  private nodoService = inject(NodoService);
  nodo= signal<NodoResponse[]>([]);
  gatewayseleccionado: GatewayResponse | null = null;
  consumoDiarioGateway = signal(0);
  consumoMensualGateway = signal(0);
  cargandoConsumo = signal(false);
  private actualizacion?: Subscription;

    //permite traer los gateways para poder seleccionar cuales nodos de x gateway van a salir
    cargarNodos(gateway: GatewayResponse): void {
      this.gatewayseleccionado = gateway;
      this.nodoService
        .obtener_nodo_por_id_gateway(gateway.id_gateway)
        .subscribe({
          next: (nodos) => {
            this.nodo.set(nodos);
            this.cargarConsumoGateway(gateway);
          },
          error: (error) => {
            console.error(error);
            this.nodo.set([]);

          }
        });

    }
    
  ngOnInit(): void {

    this.actualizacion = this.nodoService.actualizarNodos$.subscribe(() => {
      if (this.gatewayseleccionado) {
        this.cargarNodos(this.gatewayseleccionado);
      }
    });
  }

  ngOnDestroy(): void {
    this.actualizacion?.unsubscribe();
  }

  private cargarConsumoGateway(gateway: GatewayResponse): void {
    this.cargandoConsumo.set(true);
    forkJoin({
      diario: this.nodoService.obtenerConsumoDiarioGateway(gateway.id_gateway),
      mensual: this.nodoService.obtenerConsumoMensualGateway(gateway.id_gateway)
    }).subscribe({
      next: ({ diario, mensual }) => {
        this.consumoDiarioGateway.set(diario.consumo_total_kwh);
        this.consumoMensualGateway.set(mensual.consumo_total_kwh);
        this.cargandoConsumo.set(false);
      },
      error: (error) => {
        console.error('No se pudo cargar el consumo del gateway.', error);
        this.cargandoConsumo.set(false);
      }
    });
  }
}


