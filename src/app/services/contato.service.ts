import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contato } from '../models/contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  http = inject(HttpClient);

  API = 'http://localhost:8080/desafio/agenda';

  constructor() { }

  findAll(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.API + "/findAll");
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(this.API + "/delete/"+id, {responseType: 'text' as 'json'});
  }

  save(contato: Contato): Observable<string> {
    return this.http.post<string>(this.API + "/save", contato, {responseType: 'text' as 'json'});
  }

  update(contato: Contato, id: number): Observable<string> {
    return this.http.put<string>(this.API + "/update/"+id, contato, {responseType: 'text' as 'json'});
  }

  findById(id: number): Observable<Contato> {
    return this.http.get<Contato>(this.API + "/findById/"+id);
  }


}
