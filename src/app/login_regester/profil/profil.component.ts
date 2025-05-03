import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../login_regester/service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PanierService } from 'src/app/Pages/panier/service/panier.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit{
  profile: any;
  showPassword: boolean = false;

  constructor(private loginService: LoginService,private snackBar: MatSnackBar,private router: Router,private panierService : PanierService) {}
  
  ngOnInit(): void {
    this.loginService.IfLogin().subscribe({
      next: (res) => {

        if (res && res.length > 0) {
          this.profile = res[0];
          console.log(this.profile)
        } else {
          console.error('Unexpected login data:', res);
          this.snackBar.open('Erreur lors de la vérification de la connexion.', 'Fermer', { duration: 3000 });
        }
    }});
  }

  

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

deconnecter(){
  this.loginService.deconnecter(this.profile.id).subscribe({
    next: () => {
      this.panierService.obtenirPanier().subscribe({
        next: (data) => {
          var cars = data;
          cars.forEach(car => {
          this.panierService.delete(car.id).subscribe(); 
          cars = [];
        });}})
      this.snackBar.open('Deconnecter réussie!', 'Close', { duration: 3000 });
      this.router.navigate(['']);
    },
    error: (err) => {console.error('Erreur lors de la déconnexion:', err)
    this.snackBar.open('Erreur lors de la déconnexion.', 'Fermer', { duration: 3000 })

}})
}

validPassword(password : string) {
  const UpperCase = /[A-Z]/.test(password);
  const LowerCase = /[a-z]/.test(password);
  const Number = /[0-9]/.test(password);

  return UpperCase && LowerCase && Number;
  
}

  maj(form: NgForm): void {
    if (!this.profile || !form.valid) {
      this.snackBar.open('Formulaire invalide. Veuillez vérifier les champs.', 'Fermer', { duration: 3000 });
      return;
    }
    if (!this.validPassword(form.value.password)) {
      alert('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.');
      return;
    }
    
    this.profile.confirmPassword = form.value.password;
    this.loginService.updateUser(this.profile).subscribe({
      next: () => {
        this.loginService.updateUserLogin(this.profile).subscribe({
          next: () => {
            this.snackBar.open('Mise à jour réussie!', 'Fermer', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour de la session utilisateur:', err);
            this.snackBar.open('Erreur lors de la mise à jour de la session utilisateur.', 'Fermer', { duration: 3000 });
          },
        });
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        this.snackBar.open('Erreur lors de la mise à jour du profil.', 'Fermer', { duration: 3000 });
      },
    });
  }
}



