import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';
import { ContactComponent } from './Pages/contact/contact.component';
import { ProduitComponent } from './Pages/boutique/produit/produit.component';
import { LoginComponent } from './login_regester/login/login.component';
import { RegisterComponent } from './login_regester/register/register.component';
import { PanierComponent } from './Pages/panier/panier.component';
import { ListProduitComponent } from './Pages/boutique/list-produit/list-produit.component';
import { ProfilComponent } from './login_regester/profil/profil.component';
import { DashbordComponent } from './Pages/dashbord/dashbord.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'Dashbord', component: DashbordComponent},

  
  
  { path: '', redirectTo: 'cars', pathMatch: 'full' },  
  { path: 'cars', component: ListProduitComponent },
  { path: 'cars/:ref', component: ProduitComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
