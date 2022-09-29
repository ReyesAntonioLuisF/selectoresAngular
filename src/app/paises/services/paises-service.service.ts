import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private baseUrl: string = 'https://restcountries.com/v2'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion (region: string): Observable<PaisSmall[]>{
    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCode(codigo: string): Observable<Pais | null>{
    if(!codigo){
      return of(null)
    }
    const url = `${this.baseUrl}/alpha/${codigo}`
    return this.http.get<Pais>(url)
  }

  getPaisPorCodeSmall(codigo: string): Observable<PaisSmall>{
    const url = `${this.baseUrl}/alpha/${codigo}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigo(borders: string[]): Observable<PaisSmall[]>{
    if(!borders){
      return of()
    }
    const peticiones: Observable<PaisSmall>[] = []

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodeSmall(codigo)
      peticiones.push( peticion );
    })

    return combineLatest( peticiones);
  }
}
