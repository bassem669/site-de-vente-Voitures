import { Component, OnInit } from '@angular/core';
import { BoutiqueService} from '../boutique-servrse/boutique.service';
import { LoginService } from 'src/app/login_regester/service/login.service';

@Component({
  selector: 'app-list-produit',
  templateUrl: './list-produit.component.html',
  styleUrls: ['./list-produit.component.css']
})
export class ListProduitComponent implements OnInit {
  cars: any[] = [];
  type : any;
  newCar: any = {
    marque: '', model: '', prix: 0, annee: 0, url_image: '',ref: '',description: '',quantite: 1
  };

  constructor(private boutiqueService: BoutiqueService,private loginService: LoginService) {}

  ngOnInit(): void {
    this.boutiqueService.getCars().subscribe((data) => {
      this.cars = data;
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

  onSubmit(form: any): void {
    if (form.valid) {
      this.boutiqueService.checkCarExists(this.newCar.ref).subscribe({
        next: (exists) => {
          if (exists) {
            alert('Une voiture avec cette référence existe déjà.');
          } else {
            this.boutiqueService.addCar(this.newCar).subscribe({
            next: (res) => {
              alert('Voiture ajoutée avec succès !');
              this.cars.push({ ...this.newCar }); 
              form.reset();
              this.newCar = {marque: '', model: '', prix: 0, annee: 0, url_image: '', ref: '', description: '', quantite: 0 };
              },
              error: (err) => console.error('Erreur lors de l\'ajout de la voiture :', err)
            });}}})
      } else {
        alert('Veuillez remplir tous les champs correctement.');
      }
    }

  

  supprimerVoiture(car: any){
    this.boutiqueService.deleteCar(car.id).subscribe({
      next : ()  => {
        console.log('le voiture est supprimier');
        this.boutiqueService.getCars().subscribe((data) => {
          this.cars = data;
        });
      },
      error : (err) => console.error('Erreur lors de la suppression de la voiture:', err)
    })
  }
}
