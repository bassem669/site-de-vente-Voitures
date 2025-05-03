import { Component, OnInit } from '@angular/core';
import { PanierService } from './service/panier.service';
import { Car } from '../boutique/boutique.model';
import { LoginService } from '../../login_regester/service/login.service';
import { Router } from '@angular/router';
import { BoutiqueService } from '../boutique/boutique-servrse/boutique.service';


@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  cars: Car[] = [];
  listCar: Car[] = [];
  paymentInfo = {cardNumber: '', expiryDate: '', cvv: '', cardHolder: ''};
  

  constructor(private panierService: PanierService,private loginService: LoginService,private router: Router,private boutiqueService : BoutiqueService) {}

  ngOnInit(): void {
    this.panierService.obtenirPanier().subscribe({
      next: (data) => {
        this.cars = data;
        this.listCar = JSON.parse(JSON.stringify(this.cars));
      },
      error: (err) => console.error('Erreur lors de la récupération du panier', err),
    });
  }
  


  calculerTotal(): number {
    let total = 0;
    this.cars.forEach((car: { prix: number; quantite: number; }) => {
      total += car.prix * car.quantite;
    });
    return total;
  }
  

  supprimerItem(index: number): void {
    const carToDelete = this.cars[index]; 
    this.panierService.delete(carToDelete.id).subscribe({
      next: () => {
        this.cars = this.cars.filter((_: any, i: number) => i !== index);
        this.listCar = this.listCar.filter((_: any, i: number) => i !== index);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'article', err);
      }
    });
    
  }
  
  validerPaiement(form: any) {
    if (form.valid) {
      console.log('Paiement validé :', this.paymentInfo);
      const modalElement = document.getElementById('paymentModal');
      if (modalElement) {
        (modalElement as any).classList.remove('show');
        (modalElement as any).style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        return true;
      }else{
        return false;
      }
    } else {
      alert('Veuillez remplir correctement les informations de paiement.');
      return false;
    }
  }


  passerCommande(form: any): void {
    this.loginService.IfLogin().subscribe({
      next: (login) => {
        if (login.length > 0) {
          if(this.validerPaiement(form)){
            const utilisateur = { nom: login[0].firstName, email: login[0].email };
            const commande = { utilisateur, dateCommande: new Date().toISOString(),produits: this.cars.map(car => ({id: car.id,marque: car.marque,model: car.model,prix: car.prix,quantite: car.quantite})),total: this.calculerTotal()};
            console.log(this.listCar);
            console.log(this.cars);
            for(let i = 0;i<this.cars.length;i++){
              console.log(this.listCar[i].quantite);
              console.log( this.cars[i].quantite);
              this.listCar[i].quantite = this.listCar[i].quantite - this.cars[i].quantite
            }
            this.listCar.forEach(car => {
              this.boutiqueService.updateCar(car).subscribe({
                next: () => {
                  console.log('mettre a jour!');
                }})
            });
            
            this.panierService.enregistrerCommande(commande).subscribe({
              next: () => {
                alert('Commande enregistrée avec succès !');
                this.cars.forEach(car => {
                  this.panierService.delete(car.id).subscribe(); 
                });
                this.cars = [];
              },
              error: (err) => {
                console.error('Erreur lors de l\'enregistrement de la commande', err);
                alert('Une erreur est survenue lors de l\'enregistrement de la commande.');
              }
            });}
  }else{
    alert('login first');
    this.router.navigate(['/login'])
  }}})
  }
}
