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
import { NodoResponse } from '../interfaces/nodo';
import { NodoService } from '../service/nodo-service';

@Component({
  selector: 'app-detalle-nodo',
  imports: [...PRIMENG_MODULES],
  templateUrl: './detalle-nodo.html',
  styleUrl: './detalle-nodo.scss'
})
export class DetalleNodo implements OnDestroy {
  private nodoService = inject(NodoService);

  @Input() visible = false;
  @Input() nodo: NodoResponse | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  @ViewChild('graficaDiaria') graficaDiariaCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficaSemanal') graficaSemanalCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficaMensual') graficaMensualCanvas?: ElementRef<HTMLCanvasElement>;

  consumoDiario = 0;
  consumoMensual = 0;
  cargando = false;

  private graficaDiaria?: Chart;
  private graficaSemanal?: Chart;
  private graficaMensual?: Chart;
  private actualizacion?: Subscription;

  alAbrir(): void {
    if (!this.nodo) return;

    setTimeout(() => {
      if (!this.visible || !this.nodo) return;
      this.crearGraficas();
      this.iniciarActualizacion();
    }, 0);
  }

  alCerrar(): void {
    this.actualizacion?.unsubscribe();
    this.destruirGraficas();
    this.visibleChange.emit(false);
  }

  ngOnDestroy(): void {
    this.actualizacion?.unsubscribe();
    this.destruirGraficas();
  }

  private iniciarActualizacion(): void {
    if (!this.nodo) return;

    this.actualizacion?.unsubscribe();
    this.cargando = true;

    this.actualizacion = timer(0, 5000).pipe(
      switchMap(() => forkJoin({
        diario: this.nodoService.obtener_consumo_diario(this.nodo!.id_nodo),
        semanal: this.nodoService.obtener_consumo_semanal(this.nodo!.id_nodo),
        mensual: this.nodoService.obtener_consumo_mensual(this.nodo!.id_nodo)
      }))
    ).subscribe({
      next: ({ diario, semanal, mensual }) => {
        this.consumoDiario = diario.consumo_total_kwh;
        this.consumoMensual = mensual.consumo_total_kwh;

        this.actualizarGraficaTotal(this.graficaDiaria, diario.consumo_total_kwh, 'Hoy');
        this.actualizarGraficaSemanal(semanal.datos);
        this.actualizarGraficaTotal(this.graficaMensual, mensual.consumo_total_kwh, 'Este mes');
        this.cargando = false;
      },
      error: (error) => {
        console.error('No se pudieron cargar las mediciones del nodo.', error);
        this.cargando = false;
      }
    });
  }

  private crearGraficas(): void {
    this.destruirGraficas();

    if (this.graficaDiariaCanvas) {
      this.graficaDiaria = this.crearGraficaBarra(
        this.graficaDiariaCanvas.nativeElement,
        'Consumo diario'
      );
    }

    if (this.graficaMensualCanvas) {
      this.graficaMensual = this.crearGraficaBarra(
        this.graficaMensualCanvas.nativeElement,
        'Consumo mensual'
      );
    }

    if (this.graficaSemanalCanvas) {
      this.graficaSemanal = new Chart(this.graficaSemanalCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Consumo semanal (kWh)',
            data: [],
            borderColor: '#00a86f',
            backgroundColor: 'rgb(0 168 111 / 0.15)',
            fill: true,
            tension: 0.35
          }]
        },
        options: this.opcionesGrafica()
      });
    }
  }

  private crearGraficaBarra(canvas: HTMLCanvasElement, etiqueta: string): Chart {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: `${etiqueta} (kWh)`,
          data: [],
          backgroundColor: '#00a86f',
          borderRadius: 6
        }]
      },
      options: this.opcionesGrafica()
    });
  }

  private actualizarGraficaTotal(grafica: Chart | undefined, total: number, etiqueta: string): void {
    if (!grafica) return;

    grafica.data.labels = [etiqueta];
    grafica.data.datasets[0].data = [total];
    grafica.update();
  }

  private actualizarGraficaSemanal(datos: { fecha: string; consumo_kwh: number }[]): void {
    if (!this.graficaSemanal) return;

    this.graficaSemanal.data.labels = datos.map((dato) => dato.fecha);
    this.graficaSemanal.data.datasets[0].data = datos.map((dato) => dato.consumo_kwh);
    this.graficaSemanal.update();
  }

  private opcionesGrafica() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'kWh' }
        }
      }
    };
  }

  private destruirGraficas(): void {
    this.graficaDiaria?.destroy();
    this.graficaSemanal?.destroy();
    this.graficaMensual?.destroy();
    this.graficaDiaria = undefined;
    this.graficaSemanal = undefined;
    this.graficaMensual = undefined;
  }
}
