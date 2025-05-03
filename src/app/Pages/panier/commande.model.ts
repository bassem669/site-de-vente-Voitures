export interface Commande {
    utilisateur: {
      nom: string;
      email: string;
    };
    dateCommande: string;
    produits: {
      id: number;
      marque: string;
      model: string;
      prix: number;
      quantite: number;
    }[];
    total: number;
  }
  