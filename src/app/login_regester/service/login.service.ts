import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from '../login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private USERapiUrl = 'http://localhost:5000/user';
  private LOGINapiUrl = 'http://localhost:5000/login';
  constructor(private http: HttpClient) {}

  existe(email : String) : Observable<any>{
    return this.http.get(`${this.USERapiUrl}?email=${email}`);
  }
  //Ajouter au partie user
  register(data : user) : Observable<any>{
    return this.http.post(this.USERapiUrl,data);
  }
  getuser(data : user) : Observable<any>{
    return this.http.get(`${this.USERapiUrl}?email=${data.email}&&password=${data.password}`);
  }
  //Ajouter au partie login
  AjouterLogin(user : user): Observable<any>{
    return this.http.post(this.LOGINapiUrl,user);
  }
  IfLogin() : Observable<any>{
    return this.http.get(this.LOGINapiUrl);
  }
  deconnecter(id : number): Observable<any>{
    return this.http.delete(`${this.LOGINapiUrl}/${id}`);
  }
  updateUser(user: user): Observable<any> {
    return this.http.put(`${this.USERapiUrl}/${user.id}`, user);
  }
  updateUserLogin(user: user): Observable<any> {
    return this.http.put(`${this.LOGINapiUrl}/${user.id}`, user);
  }
}
