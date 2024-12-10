import { Component } from '@angular/core';
import { ProductoInventarioService } from '../core/services/producto-inventario.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../core/services/productos.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ProductoInvetario } from '../core/models/productoInventario.models';
import { ProductoInventarioDto } from '../core/models/produco-inventario-dto.models';
import { ProductoDto } from '../core/models/producto-dto.models';

@Component({
  selector: 'app-productos-inventario',
  templateUrl: './productos-inventario.component.html',
  styleUrls: ['./productos-inventario.component.scss']
})
export class ProductosInventarioComponent {

  productosInventario: ProductoInventarioDto[];
  size: any;
  page: number;
  totalRecords: any;
  loading: any;

  showCrearProductoInventario: boolean;

  producto: any;
  productoInventarioForm: FormGroup;

  estadoBusquedaPro: boolean;

  fechaAcutal: Date;

  isActualizar: boolean;

  constructor(private productoInveatarioService: ProductoInventarioService,
    private messageService: MessageService, private productoService: ProductosService
  ) {
    this.page = 0;
    this.size = 10;
    this.productoInventarioForm = new FormGroup({
      fechaCaduca: new FormControl(),
      cantidad: new FormControl(),
      idProducto: new FormControl(),
      nombreProducto: new FormControl(),
      consecutivo: new FormControl()
    });
    this.showCrearProductoInventario = false;
    this.estadoBusquedaPro = true;
    this.fechaAcutal = new Date();
    this.productosInventario = [];
    this.isActualizar = false;
  }

  ngOnInit(): void {
    this.getProductoInventarios(0);
  }

  initFormProductoInventario() {
    this.productoInventarioForm = new FormGroup({
      fechaCaduca: new FormControl(),
      cantidad: new FormControl(),
      idProducto: new FormControl(),
      nombreProducto: new FormControl(),
      consecutivo: new FormControl()
    });
  }

  lazyloadRecords(event: any) {
    const requestPage = event.first / event.rows;
    const nextPage = requestPage > 0 ? requestPage + 1 : 0;

    if (nextPage < requestPage) {
      return;
    }

    this.page = requestPage;

    this.getProductoInventarios();
  }

  getProductoInventarios(page: any = null) {
    if (page != null) this.page = page;
    this.productoInveatarioService.getAllProductoInventario(null, this.page, this.size)
      .subscribe({
        next: value => {
          if (value?.totalElements) {
            this.productosInventario = value.content;
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

  consultarProducto() {
    if (this.validarFiltroDebusqueda()) {
      this.productoService.getProducto(this.productoInventarioForm.get("idProducto")?.value, this.productoInventarioForm.get("nombreProducto")?.value)
        .subscribe({
          next: value => {
            if (value) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Producto encontrado correctamente' });
              this.productoInventarioForm.patchValue({
                nombreProducto: value.nombreProducto,
                idProducto: value.idProducto
              });
              this.estadoBusquedaPro = false;
              this.producto = value;
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'no se encontro un producto con los filtros diligenciados' });
            }
          }
        })
    }
  }

  agregarProductoInvetario() {
    if (this.validarForulario()) {
      Swal.fire({
        text: 'Agregabdo product en el inventario... ',
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      Swal.showLoading(null);

      let newProdcutInvetario = new ProductoInvetario();
      newProdcutInvetario = {
        fechaCaduca: moment(this.productoInventarioForm.get("fechaCaduca")?.value).format("DD/MM/YYYY"),
        cantidad: this.productoInventarioForm.get("cantidad")?.value,
        idProducto: this.productoInventarioForm.get("idProducto")?.value
      };

      this.productoInveatarioService.saveProductoInventario(newProdcutInvetario).subscribe({
        next: value => {
          if (value.valor > 0) {
            this.showCrearProductoInventario = false;
            Swal.fire({
              text: `${value.respuesta}, consecutivo ${value.valor}`,
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'ok'
            })
            this.getProductoInventarios();
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
        }, error: err => {
          console.log(err);
        }
      });
    }

  }

  validarForulario(): boolean {
    if (this.productoInventarioForm.get("fechaCaduca")?.value == null || moment(this.productoInventarioForm.get("fechaCaduca")?.value).isBefore(moment(this.fechaAcutal))) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'ingrese una fecha correcta' });
      return false;
    }

    if (this.productoInventarioForm.get("cantidad")?.value == null || this.productoInventarioForm.get("cantidad")?.value <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'ingrese una cantidad correcta' });
      return false;
    }

    return true;
  }

  validarFiltroDebusqueda(): boolean {

    if (this.productoInventarioForm.get("idProducto")?.value == null && this.productoInventarioForm.get("nombreProducto")?.value == null) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'ingrese por lo menos un filtro de busquedad' });
      return false;
    }

    return true;
  }

  limpiar() {
    this.initFormProductoInventario();
    this.showCrearProductoInventario = false;
    this.estadoBusquedaPro = true;
  }

  validarFormularioUpdate() {

    if (this.productoInventarioForm.get("fechaCaduca")?.value == null || moment(this.productoInventarioForm.get("fechaCaduca")?.value).isBefore(moment(this.fechaAcutal))) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'ingrese una fecha correcta' });
      return false;
    }

    if (this.productoInventarioForm.get("cantidad")?.value == null || this.productoInventarioForm.get("cantidad")?.value < 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'ingrese una cantidad correcta' });
      return false;
    }

    return true;
  }

  actualizarProductoInvetario() {
    if (this.validarFormularioUpdate()) {
      Swal.fire({
        text: 'Actualizado producto en el inventario... ',
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      Swal.showLoading(null);

      let newProdcutInvetario = new ProductoInvetario();
      newProdcutInvetario = {
        fechaCaduca: moment(new Date(this.productoInventarioForm.get("fechaCaduca")?.value)).format("DD/MM/YYYY"),
        cantidad: this.productoInventarioForm.get("cantidad")?.value,
        idProducto: this.productoInventarioForm.get("idProducto")?.value,
        consecutivo: this.productoInventarioForm.get("consecutivo")?.value
      };

      this.productoInveatarioService.updateProductoInventario(newProdcutInvetario).subscribe({
        next: value => {
          if (value.valor > 0) {
            this.showCrearProductoInventario = false;
            this.isActualizar = false;
            Swal.fire({
              text: `${value.respuesta}, consecutivo ${value.valor}`,
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'ok'
            })
            this.getProductoInventarios();
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
        }, error: err => {
          console.log(err);
        }
      });
    }
  }

  modificarProductoInvetario(product: ProductoInventarioDto) {
    this.productoInventarioForm.patchValue({
      nombreProducto: product.nombreProducto,
      idProducto: product.idProducto,
      fechaCaduca: moment(product.fechaCaduca).format("DD/MM/YYYY"),
      cantidad: product.cantidad,
      consecutivo: product.consecutivo
    });
    this.productoInventarioForm.get("nombreProducto")?.disable();
    this.productoInventarioForm.get("idProducto")?.disable();
    this.showCrearProductoInventario = true;
    this.isActualizar = true;
  }

  cerrarModal() {
    this.initFormProductoInventario();
    this.showCrearProductoInventario = false;
    this.isActualizar = false;
    this.estadoBusquedaPro = true;
  }

  desactivarProducto(product: ProductoInventarioDto) {

    Swal.fire({
      text: 'Inactivando producto en el inventario... ',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    Swal.showLoading(null);

    let productoInvetario = new ProductoInvetario();

    productoInvetario = {
      fechaCaduca: moment(product.fechaCaduca).format("DD/MM/YYYY"),
      cantidad: product.cantidad,
      idProducto: product.idProducto,
      consecutivo: product.consecutivo
    };
    this.productoInveatarioService.inactivarProductoInventario(productoInvetario).subscribe({
      next: value => {
        if (value.valor > 0) {
          this.showCrearProductoInventario = false;
          this.isActualizar = false;
          Swal.fire({
            text: `${value.respuesta}, consecutivo ${value.valor}`,
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'ok'
          })
          this.getProductoInventarios();
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
      }, error: err => {
        console.log(err);
      }
    });

  }

}
