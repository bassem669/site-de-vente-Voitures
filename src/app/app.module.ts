import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { HeaderComponent } from './EnssencialElement/header/header.component';
import { FooterComponent } from './EnssencialElement/footer/footer.component';
import { HomeComponent } from './Pages/home/home.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';
import { ProduitComponent } from './Pages/boutique/produit/produit.component';
import { ContactComponent } from './Pages/contact/contact.component';
import { LoginComponent } from './login_regester/login/login.component';
import { RegisterComponent } from './login_regester/register/register.component';
import { PanierComponent } from './Pages/panier/panier.component';
import { ListProduitComponent } from './Pages/boutique/list-produit/list-produit.component';
import { PanierService } from './Pages/panier/service/panier.service';
import { ProfilComponent } from './login_regester/profil/profil.component';
import { DashbordComponent } from './Pages/dashbord/dashbord.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    ProduitComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    PanierComponent,
    ListProduitComponent,
    ProfilComponent,
    DashbordComponent,
  ],

  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    
  ],
  providers: [PanierService],
  bootstrap: [AppComponent]
})
export class AppModule { }
