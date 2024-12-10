import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.models';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private readonly baseUrl = 'http://localhost:8080/api/productos'

  constructor(private http: HttpClient) { }

  getProductos(nombreProducto: any, idProducto: any, page: number, size: number): Observable<any> {
    const url = this.baseUrl + '/listar-productos'
    let params = new HttpParams();

    if (nombreProducto) {
      params = params.set('nombreProducto', nombreProducto);
    }

    if (idProducto) {
      params = params.set('idProducto', idProducto.toString());
    }

    if (page) {
      params = params.set('page', page.toString());
    }

    if (size) {
      params = params.set('size', size.toString())
    }

    return this.http.get<any>(url, { params });

  }

  saveProducto(producto: Producto): Observable<any> {
    const url = this.baseUrl + '/guardar-producto';
    return this.http.post<any>(url, producto);
  }

  getProducto(idProducto: number, nombreProducto: string): Observable<any>{
    const url = this.baseUrl+'/consultar-producto';
    let params = new HttpParams();
    
    if(idProducto != null){
      params = params.set('idProducto', idProducto);
    }

    if(nombreProducto != null ){
      params = params.set('nombreProducto', nombreProducto)
    }

    return this.http.get<any>(url, {params});
  }

}
