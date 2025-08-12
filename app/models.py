from __future__ import annotations

from datetime import datetime, date
from enum import Enum
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


class RoleUtilisateur(str, Enum):
    CLIENT = "CLIENT"
    ENTREPRISE = "ENTREPRISE"
    ADMIN = "ADMIN"


class TypeBien(str, Enum):
    MAISON = "MAISON"
    APPARTEMENT = "APPARTEMENT"
    TERRAIN = "TERRAIN"
    LOCAL_COMMERCIAL = "LOCAL_COMMERCIAL"


class TypeTransaction(str, Enum):
    LOCATION = "LOCATION"
    ACHAT = "ACHAT"


class EtatAnnonce(str, Enum):
    BROUILLON = "BROUILLON"
    PUBLIEE = "PUBLIEE"
    SUSPENDUE = "SUSPENDUE"
    REFUSEE = "REFUSEE"
    ARCHIVEE = "ARCHIVEE"


class StatutDemande(str, Enum):
    EN_ATTENTE = "EN_ATTENTE"
    ACCEPTEE = "ACCEPTEE"
    REFUSEE = "REFUSEE"
    ANNULEE = "ANNULEE"


class Utilisateur(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    mot_de_passe_hash: str
    nom: Optional[str] = None
    prenom: Optional[str] = None
    date_naissance: Optional[date] = None
    telephone: Optional[str] = None
    role: RoleUtilisateur = Field(default=RoleUtilisateur.CLIENT)
    actif: bool = Field(default=True)
    cree_le: datetime = Field(default_factory=datetime.utcnow)
    maj_le: datetime = Field(default_factory=datetime.utcnow)

    entreprise: Optional[Entreprise] = Relationship(back_populates="responsable", sa_relationship_kwargs={"uselist": False})


class Entreprise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nom_entreprise: str
    verifiee: bool = Field(default=False)
    responsable_id: int = Field(foreign_key="utilisateur.id")

    responsable: Utilisateur = Relationship(back_populates="entreprise")
    annonces: list[Annonce] = Relationship(back_populates="entreprise")


class Adresse(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ligne1: str
    ligne2: Optional[str] = None
    ville: str
    code_postal: str
    pays: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class BienImmobilier(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    reference: str
    surface_m2: float
    nombre_pieces: int
    type_bien: TypeBien
    classe_energetique: Optional[str] = None
    annee_construction: Optional[int] = None
    adresse_id: Optional[int] = Field(default=None, foreign_key="adresse.id")

    adresse: Optional[Adresse] = Relationship()
    photos: list[Photo] = Relationship(back_populates="bien")
    annonce: Optional[Annonce] = Relationship(back_populates="bien")


class Photo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str
    ordre: int = 0
    legende: Optional[str] = None
    bien_id: int = Field(foreign_key="bienimmobilier.id")

    bien: BienImmobilier = Relationship(back_populates="photos")


class Annonce(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titre: str
    description: str
    type_transaction: TypeTransaction
    prix: float
    date_publication: datetime = Field(default_factory=datetime.utcnow)
    etat: EtatAnnonce = Field(default=EtatAnnonce.BROUILLON)
    visites_compteur: int = 0
    favoris_compteur: int = 0

    bien_id: int = Field(foreign_key="bienimmobilier.id")
    entreprise_id: int = Field(foreign_key="entreprise.id")

    bien: BienImmobilier = Relationship(back_populates="annonce")
    entreprise: Entreprise = Relationship(back_populates="annonces")
    demandes: list[Demande] = Relationship(back_populates="annonce")


class Demande(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date_demande: datetime = Field(default_factory=datetime.utcnow)
    statut: StatutDemande = Field(default=StatutDemande.EN_ATTENTE)
    type_transaction: TypeTransaction
    message: Optional[str] = None

    client_id: int = Field(foreign_key="utilisateur.id")
    annonce_id: int = Field(foreign_key="annonce.id")
    entreprise_id: int = Field(foreign_key="entreprise.id")

    client: Utilisateur = Relationship()
    annonce: Annonce = Relationship(back_populates="demandes")
    entreprise: Entreprise = Relationship()