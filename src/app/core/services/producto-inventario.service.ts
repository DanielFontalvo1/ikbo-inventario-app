import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoInvetario} from '../models/productoInventario.models';

@Injectable({
  providedIn: 'root'
})
export class ProductoInventarioService {

  private readonly baseUrl = 'http://localhost:8080/api/producto-inventario'

  constructor(private http: HttpClient) { }

  getAllProductoInventario(nombreProducto: any, page: number = 0, size: number = 10): Observable<any>{
    const url = this.baseUrl+'/listar-producto-inventario';
    let params = new HttpParams();

    if(nombreProducto){
      params = params.set('nombreProducto', nombreProducto);
    }

    if(page !== undefined && page !== null){
     params =  params.set('page', page.toString());
    }

    if(size !== undefined && size !== null){
      params = params.set('size', size.toString())
    }

    return this.http.get<any>(url, {params});
  }

  saveProductoInventario(productoInvetario: ProductoInvetario): Observable<any>{
    const url = this.baseUrl+'/guardar-producto-inventario';
    return this.http.post<any>(url, productoInvetario);
  }

  updateProductoInventario(productoInvetario: ProductoInvetario): Observable<any>{
    const url = this.baseUrl+'/actualizar-producto-invetario';
    return this.http.post<any>(url, productoInvetario);
  }

  inactivarProductoInventario(productoInvetario: ProductoInvetario): Observable<any>{
    const url = this.baseUrl+'/inactivar-producto-inventario';
    return this.http.post<any>(url, productoInvetario);
  }

}
