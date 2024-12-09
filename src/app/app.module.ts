import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { InventarioComponent } from './inventario/inventario.component';
import { TabViewModule } from 'primeng/tabview';
import { ProductosInventarioComponent } from './productos-inventario/productos-inventario.component';


@NgModule({
  declarations: [
    AppComponent,
    InventarioComponent,
    ProductosInventarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    TabViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
