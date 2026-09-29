import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase';
// Importaremos chart.js y jspdf más adelante

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  styleUrl: './admin-panel.css',
  templateUrl: './admin-panel.html',
})
export class AdminPanel {
  private supabaseService = inject(SupabaseService);

  // Controla qué pantalla del admin se está viendo
  tabActivo = signal<'reportes' | 'cartelera' | 'logs'>('reportes');

  // Datos para los reportes
  totalFacturado = signal<number>(0);
  entradasVendidas = signal<number>(0);
  cargando = signal<boolean>(false);

  constructor() {
    this.cargarDatosReportes();
  }

  cambiarTab(tab: 'reportes' | 'cartelera' | 'logs') {
    this.tabActivo.set(tab);
  }

  async cargarDatosReportes() {
    this.cargando.set(true);
    try {
      this.totalFacturado.set(150000); 
      this.entradasVendidas.set(45); 
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  exportarPDF() {
    alert('Próximamente: Exportando reporte a PDF...');
  }

  exportarExcel() {
    alert('Próximamente: Exportando reporte a Excel...');
  }
}