import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Car } from '../boutique.model';
@Injectable({
  providedIn: 'root'
})

export class BoutiqueService {
  private apiUrl = 'http://localhost:3000/CAR';

  constructor(private http: HttpClient) {}

  getCars():Observable<Car[]>{
    return this.http.get<Car[]>(this.apiUrl);
  }

  deleteCar(id : any): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addCar(car : any) :Observable<any>{
    return this.http.post(this.apiUrl, car);
  }

  checkCarExists(ref: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?ref=${ref}`).pipe(
      map((cars) => cars.length > 0)
    );
  }
  updateCar(car : Car) :Observable<any>{
    return this.http.put(`${this.apiUrl}/${car.id}`, car);

  }
}
