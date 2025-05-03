import { Injectable } from '@angular/core';
import { Car } from '../../boutique/boutique.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../commande.model';
@Injectable({
  providedIn: 'root',
})
export class PanierService {

  private ApiUrl = 'http://localhost:3000/panier';
  private ApiUrlC = 'http://localhost:3000/Commande';
  constructor(private http: HttpClient) {}
  
  existe(ref : String) : Observable<any>{
    return this.http.get(`${this.ApiUrl}?ref=${ref}`);
  }

  ajouterAuPanier(car: Car): Observable<any> {
    return this.http.post(this.ApiUrl,car);
  }

  obtenirPanier() : Observable<Car[]>{
    return this.http.get<Car[]>(this.ApiUrl);
  }

  delete(id : number) : Observable<any>{
    return this.http.delete(`${this.ApiUrl}/${id}`);
  }
  enregistrerCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.ApiUrlC, commande);
  }
  getCommandes(): Observable<any[]> {
    return this.http.get<any[]>(this.ApiUrlC);
  }
}
