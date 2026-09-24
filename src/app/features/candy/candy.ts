import { Component, inject, OnInit } from '@angular/core';
import { CandyService } from '../../core/services/candy.service';


@Component({
  selector: 'app-candy',
  styleUrl: './candy.css',
  templateUrl: './candy.html',
})
export class Candy implements OnInit{
  private candyService = inject(CandyService);
  
  productos = this.candyService.productos;
  loading = this.candyService.loading;

  ngOnInit() {
    this.candyService.loadProductos();    
  }
}
