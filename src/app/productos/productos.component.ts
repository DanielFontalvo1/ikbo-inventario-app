import { Component, ViewChild } from '@angular/core';
import { ProductosService } from '../core/services/productos.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl } from '@angular/forms';
import { Producto } from '../core/models/producto.models';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductoDto } from '../core/models/producto-dto.models';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent {

  @ViewChild('dt') table?: Table;

  productos: ProductoDto[];
  productoForm: FormGroup;

  size: any;
  page: number;
  totalRecords: any;
  loading: any;

  showCrearProducto: boolean;

  constructor(private productoService: ProductosService, private messageService: MessageService) {
    this.page = 0;
    this.size = 5;
    this.showCrearProducto = false;
    this.productos = [];
    this.productoForm = new FormGroup({
      nombreProducto: new FormControl(),
      precioUnitario: new FormControl()
    });
  }

  ngOnInit(): void {
    this.getProductos(0);
  }

  initProductForm() {
    this.productoForm = new FormGroup({
      nombreProducto: new FormControl(),
      precioUnitario: new FormControl()
    });
  }

  lazyloadRecords(event: any) {
    const requestPage = Math.floor(event.first / event.rows);
    const nextPage = requestPage > 0 ? requestPage + 1 : 0;

    if (nextPage < requestPage) {
        return;
    }

    this.page = requestPage;

    this.getProductos();
  }

  getProductos(page: any = null) {
    if (page != null) this.page = page;
    this.productoService.getProductos(null, 0, this.page, this.size)
      .subscribe({
        next: value => {
          if (value?.totalElements) {
            this.productos = value.content;
            this.totalRecords = value?.totalElements;
            this.page = value?.pageable?.pageNumber;
            this.loading = false;
          }
        },
        error: err => {
          console.log(err);
        }
      })
  }

  validarFormularioProducto(): boolean {

    if (this.productoForm.get("nombreProducto")?.value == null) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Por favor ingrese el nombre del producto' });
      return false;
    }

    if(this.productoForm.get("precioUnitario")?.value && this.productoForm.get("precioUnitario")?.value <= 0){
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Por favor ingrese un precio valido' });
      return false;
    }

    return true;
  }

  agregarProducto() {
    if (this.validarFormularioProducto()) {

      Swal.fire({
        text: 'Agregabdo producto... ',
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      Swal.showLoading(null);

      let newproducto: Producto = new Producto();
      newproducto = {
        nombreProducto: this.productoForm.get("nombreProducto")?.value,
        precioUnitario: this.productoForm.get("precioUnitario")?.value
      }

      this.productoService.saveProducto(newproducto).subscribe({
        next: value => {
          if (value.valor > 0) {
            this.showCrearProducto = false;
            Swal.fire({
              text: `${value.respuesta} producto ${value.valor}`,
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'ok'
            })
            this.getProductos(0);
            this.limpiar();
          }
          if (value.valor <= 0) {
            Swal.fire({
              text: `${value.respuesta}`,
              icon: 'warning',
              showConfirmButton: true,
              confirmButtonText: 'ok'
            })
          }
        }, error: err =>{
          Swal.fire({
            text: 'No se pudo guardar el producto',
            icon: 'error',
            title: err?.status
          });
          console.log(err);
        }
      })
    }
  }

  limpiar() {
    this.initProductForm();
    this.showCrearProducto = false;
  }

}
