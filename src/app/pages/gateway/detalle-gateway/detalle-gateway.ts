import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import Chart from 'chart.js/auto';
import { forkJoin, Subscription, switchMap, timer } from 'rxjs';
import { PRIMENG_MODULES } from '../../../layout/primeng/primeng';
import { GatewayResponse } from '../interfaces/gateway';
import { GatewayService } from '../services/gateway-services';

@Component({
  selector: 'app-detalle-gateway',
  imports: [...PRIMENG_MODULES],
  templateUrl: './detalle-gateway.html',
  styleUrl: './detalle-gateway.scss'
})
export class DetalleGateway implements OnDestroy {
  private gatewayService = inject(GatewayService);

  @Input() visible = false;
  @Input() gateway: GatewayResponse | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  @ViewChild('graficaSemanal') graficaSemanalCanvas?: ElementRef<HTMLCanvasElement>;

  consumoDiario = 0;
  consumoMensual = 0;
  valorKwh = 0;
  costoEstimado = 0;
  cargando = false;

  private graficaSemanal?: Chart;
  private actualizacion?: Subscription;

  alAbrir(): void {
    if (!this.gateway) return;
    // p-dialog ejecuta onShow durante la detección de cambios inicial.
    // Diferimos la carga para no cambiar `cargando` en medio de esa verificación.
    setTimeout(() => {
      if (!this.visible || !this.gateway) return;
      this.crearGrafica();
      this.iniciarActualizacion();
    }, 0);
  }

  alCerrar(): void {
    this.actualizacion?.unsubscribe();
    this.destruirGrafica();
    this.visibleChange.emit(false);
  }

  calcularCosto(): void {
    this.costoEstimado = Math.max(0, this.consumoMensual) * Math.max(0, Number(this.valorKwh) || 0);
  }

  ngOnDestroy(): void {
    this.actualizacion?.unsubscribe();
    this.destruirGrafica();
  }

  private iniciarActualizacion(): void {
    if (!this.gateway) return;
    this.actualizacion?.unsubscribe();
    this.cargando = true;

    this.actualizacion = timer(0, 5000).pipe(
      switchMap(() => forkJoin({
        diario: this.gatewayService.obtenerConsumoDiarioGateway(this.gateway!.id_gateway),
        mensual: this.gatewayService.obtenerConsumoMensualGateway(this.gateway!.id_gateway),
        semanal: this.gatewayService.obtenerConsumoSemanalGateway(this.gateway!.id_gateway)
      }))
    ).subscribe({
      next: ({ diario, mensual, semanal }) => {
        this.consumoDiario = diario.consumo_total_kwh;
        this.consumoMensual = mensual.consumo_total_kwh;
        this.calcularCosto();
        this.actualizarGrafica(semanal.datos);
        this.cargando = false;
      },
      error: (error) => {
        console.error('No se pudieron cargar las mediciones del gateway.', error);
        this.cargando = false;
      }
    });
  }

  private crearGrafica(): void {
    this.destruirGrafica();
    if (!this.graficaSemanalCanvas) return;

    this.graficaSemanal = new Chart(this.graficaSemanalCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Consumo semanal (kWh)',
          data: [],
          borderColor: '#007e59',
          backgroundColor: 'rgb(0 126 89 / 0.15)',
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, title: { display: true, text: 'kWh' } } }
      }
    });
  }

  private actualizarGrafica(datos: { fecha: string; consumo_kwh: number }[]): void {
    if (!this.graficaSemanal) return;
    this.graficaSemanal.data.labels = datos.map(dato => dato.fecha);
    this.graficaSemanal.data.datasets[0].data = datos.map(dato => dato.consumo_kwh);
    this.graficaSemanal.update();
  }

  private destruirGrafica(): void {
    this.graficaSemanal?.destroy();
    this.graficaSemanal = undefined;
  }
}
