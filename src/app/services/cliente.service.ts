import { Injectable } from '@angular/core';
import { Cliente } from '../models/client'
import { ClienteLogin } from '../models/clienteLogin'

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  API_URI = '/wtcliente'

  constructor(private http: HttpClient) { }

  getClientes() {
    return this.http.get(`${this.API_URI}`);
  }

  saveCliente(cliente: Cliente) {
    return this.http.post(`${this.API_URI}/add`, cliente);
  }

  getGatosPorCategorias(idCliente: number) {
    return this.http.get(`${this.API_URI}/gastosPorCategoria/${idCliente}/2020-01-01/2031-12-31`);
  }

  loginCliente(cliente: ClienteLogin) {
    console.log(cliente)
    return this.http.post(`${this.API_URI}/login`, cliente);
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.API_URI}/upd`, cliente);
  }

  getClienteById(id : Int16Array){
    return this.http.get(`${this.API_URI}/${id}`)
  }
}
