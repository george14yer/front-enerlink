import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription, forkJoin, switchMap, timer } from 'rxjs';
import { GatewayService } from '../gateway/services/gateway-services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, ButtonModule, InputTextModule],
  template: `
    <div class="dashboard-header">
      <div>
        <h1>Resumen energético</h1>
        <p>Información general de tus viviendas y gateways.</p>
      </div>
      @if (cargando()) { <i class="pi pi-spin pi-spinner"></i> }
    </div>

    <div class="dashboard-grid">
      <div class="metric-card">
        <span>Consumo total de hoy</span>
        <strong>{{ consumoDiario() | number:'1.2-2' }} kWh</strong>
        <i class="pi pi-bolt"></i>
      </div>
      <div class="metric-card">
        <span>Consumo total del mes</span>
        <strong>{{ consumoMensual() | number:'1.2-2' }} kWh</strong>
        <i class="pi pi-calendar"></i>
      </div>
      <div class="metric-card">
        <span>Gateways registrados</span>
        <strong>{{ gateways() }}</strong>
        <i class="pi pi-wifi"></i>
      </div>
    </div>

    <div class="dashboard-columns">
      <section class="dashboard-card">
        <h2>Consumo semanal general</h2>
        <p-chart type="line" [data]="graficaSemanal()" [options]="opcionesGrafica" class="chart"></p-chart>
      </section>
      <section class="dashboard-card">
        <h2>Consumo anual general</h2>
        <p-chart type="bar" [data]="graficaAnual()" [options]="opcionesGrafica" class="chart"></p-chart>
      </section>
    </div>

    <section class="calculator-card">
      <div>
        <h2>Calculadora de costo aproximado</h2>
        <p>Calcula cuánto pagarías según el consumo mensual registrado.</p>
      </div>
      <div class="calculator-form">
        <input pInputText type="number" min="0" [(ngModel)]="valorKwh" placeholder="Valor del kWh" />
        <button pButton type="button" label="Calcular" icon="pi pi-calculator" (click)="calcularCosto()"></button>
        <strong>{{ costoEstimado() | currency:'COP':'symbol':'1.0-0':'es-CO' }}</strong>
      </div>
    </section>
  `,
  styles: [`
    .dashboard-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
    .dashboard-header h1 { margin:0 0 .35rem; font-size:1.8rem; }
    .dashboard-header p { margin:0; color:var(--text-color-secondary); }
    .dashboard-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; margin-bottom:1rem; }
    .metric-card, .dashboard-card, .calculator-card { border:1px solid var(--surface-border); border-radius:12px; background:var(--surface-card); padding:1.25rem; }
    .metric-card { position:relative; display:flex; flex-direction:column; gap:.5rem; min-height:8rem; }
    .metric-card span, .calculator-card p { color:var(--text-color-secondary); }
    .metric-card strong { color:var(--primary-color); font-size:1.6rem; }
    .metric-card i { position:absolute; right:1.25rem; top:1.25rem; color:var(--primary-color); font-size:1.5rem; }
    .dashboard-columns { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; margin-bottom:1rem; }
    .dashboard-card h2, .calculator-card h2 { margin:0 0 1rem; font-size:1.15rem; }
    .chart { display:block; height:22rem; }
    .calculator-card { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
    .calculator-card p { margin:0; }
    .calculator-form { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; justify-content:flex-end; }
    .calculator-form input { width:10rem; }
    .calculator-form strong { color:var(--primary-color); min-width:8rem; font-size:1.2rem; }
    @media (max-width: 800px) { .dashboard-grid, .dashboard-columns { grid-template-columns:1fr; } .calculator-card { display:grid; } .calculator-form { justify-content:flex-start; } }
  `]
})
export class Dashboard implements OnInit, OnDestroy {
  private gatewayService = inject(GatewayService);
  private actualizacion?: Subscription;

  consumoDiario = signal(0);
  consumoMensual = signal(0);
  gateways = signal(0);
  costoEstimado = signal(0);
  cargando = signal(false);
  valorKwh = 0;

  graficaSemanal = signal<any>({ labels: [], datasets: [] });
  graficaAnual = signal<any>({ labels: [], datasets: [] });

  opcionesGrafica = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'kWh' } } }
  };

  ngOnInit(): void {
    this.actualizacion = timer(0, 5000).pipe(
      switchMap(() => forkJoin({
        diario: this.gatewayService.obtenerConsumoDiarioTotal(),
        mensual: this.gatewayService.obtenerConsumoMensualTotal(),
        semanal: this.gatewayService.obtenerConsumoSemanalTotal(),
        anual: this.gatewayService.obtenerConsumoAnualTotal()
      }))
    ).subscribe({
      next: ({ diario, mensual, semanal, anual }) => {
        this.consumoDiario.set(diario.consumo_total_kwh);
        this.consumoMensual.set(mensual.consumo_total_kwh);
        this.gateways.set(mensual.gateways_incluidos);
        this.calcularCosto();
        this.graficaSemanal.set({
          labels: semanal.datos.map(dato => dato.fecha),
          datasets: [{ label: 'kWh', data: semanal.datos.map(dato => dato.consumo_kwh), borderColor: '#007e59', backgroundColor: 'rgb(0 126 89 / 0.15)', fill: true, tension: .35 }]
        });
        this.graficaAnual.set({
          labels: anual.datos.map(dato => `${dato.mes}/${dato.anio}`),
          datasets: [{ label: 'kWh', data: anual.datos.map(dato => dato.consumo_kwh), backgroundColor: '#00a86f', borderRadius: 6 }]
        });
        this.cargando.set(false);
      },
      error: error => {
        console.error('No se pudo cargar el dashboard.', error);
        this.cargando.set(false);
      }
    });
  }

  calcularCosto(): void {
    this.costoEstimado.set(Math.max(0, this.consumoMensual()) * Math.max(0, Number(this.valorKwh) || 0));
  }

  ngOnDestroy(): void {
    this.actualizacion?.unsubscribe();
  }
}
