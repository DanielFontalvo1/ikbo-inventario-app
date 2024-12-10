import { Estado } from './estado.models';
export class ProductoDto{
    idProducto?: number;
    nombreProducto?: string;
    fechaRegistro?: Date;
    precioUnitario?: number;
    estado?: Estado;
}