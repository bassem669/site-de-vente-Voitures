import { Component } from '@angular/core';
import { PanierService } from '../panier/service/panier.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent {
  commandes: any[] = [];

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.panierService.getCommandes().subscribe({
      next: (data) => {
        
        this.commandes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes', err);
      }
    });
    console.log(this.commandes);
}
}
