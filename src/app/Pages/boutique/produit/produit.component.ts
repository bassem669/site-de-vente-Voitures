import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoutiqueService } from '../boutique-servrse/boutique.service';
import { Car } from '../boutique.model';
import { PanierService } from '../../panier/service/panier.service'
import { LoginService } from 'src/app/login_regester/service/login.service';
@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit{
  car: any;
  type : any;

  constructor(
    private route: ActivatedRoute,
    private boutiqueService: BoutiqueService,
    private panierService: PanierService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const carRef = this.route.snapshot.paramMap.get('ref');
    this.boutiqueService.getCars().subscribe((data) => {
      this.car = data.find((c) => c.ref === carRef); 
      console.log(this.car);
    });
    this.loginService.IfLogin().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.loginService.getuser(res[0]).subscribe({
            next: (res1) => {
              if(res1[0].type == "admin"){
                this.type = true;
              }else{
                this.type = false;
              }
            },
            error: (err) => console.error('Error fetching user:', err),
          });
        } else {
          this.type = false;
          console.error('Unexpected login data:', res);
          console.log('Erreur lors de la vérification de la connexion.', 'Fermer', { duration: 3000 });
        }
    }});
  }

  ajouterAuPanier(): void {
    if (this.car) { 
      this.panierService.existe(this.car.ref).subscribe({
        next: (carExist) => {
          if (carExist.length == 0) {
            if (this.car) {
              this.panierService.ajouterAuPanier(this.car).subscribe({
                next: () => alert(`${this.car?.marque} ${this.car?.model} a été ajouté au panier !`),
                error: (err) => console.error('Erreur lors de l\'ajout au panier', err),
      });}
          }else{
            alert('Le voiture est existe a la panier')
            }},
      error: (err) => alert('Le voiture est existe a la panier')
    })
    }}
  
    mettreAJourVoiture(): void {
      this.boutiqueService.updateCar(this.car).subscribe({
        next: () => {
          alert('Voiture mise à jour avec succès.');
          const modalElement = document.getElementById('updateCarModal');
          if (modalElement) {
            (modalElement as any).classList.remove('show');
            (modalElement as any).style.display = 'none';
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la voiture', err);
          alert('Une erreur est survenue lors de la mise à jour.');
        },
      });
    }
    
}
