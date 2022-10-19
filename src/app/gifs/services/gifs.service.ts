import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'XTJbEWZ4wrQ5bFLp1wCpizAqp29cITCy';
  private servicioURL: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];  
  
  get historial() {
    return [...this._historial];
  }

  //Inicializar un servicio
  constructor(private http: HttpClient){
      
      //this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

      if (localStorage.getItem('historial')){
        this._historial = JSON.parse(localStorage.getItem('historial')!);
      }

      if (localStorage.getItem('resultados')){
        this.resultados = JSON.parse(localStorage.getItem('resultados')!);
      }
  }

  buscarGifs( query: string) {

    query = query.trim().toUpperCase();

    if (!this._historial.includes(query)){ //No incluir resultados repetidos
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10); //Solo guarda los ultimos 10 en el arreglo.

      localStorage.setItem('historial', JSON.stringify(this._historial)); //guardamos en el LocalStorage del navegador web.
    }
    
    //Conexion a API y devolver .data
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', 10);

    this.http.get<SearchGifsResponse>(`${ this.servicioURL }/search`, { params })
      .subscribe( (resp) => {
        console.log(resp.data);
        this.resultados = resp.data;

        //this.resultados.unshift(resp.data);

        localStorage.setItem('resultados', JSON.stringify(this.resultados));

      });

    
    
  }

  

}
