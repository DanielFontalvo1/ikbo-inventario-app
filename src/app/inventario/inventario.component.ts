import { Component } from '@angular/core';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent {
  activeIndex: number = 0;

  onTabChange(event: any){
    this.activeIndex = event.index;
  }

}
