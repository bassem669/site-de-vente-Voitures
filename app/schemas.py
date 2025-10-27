from __future__ import annotations

from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field

from .models import TypeBien, TypeTransaction, EtatAnnonce, StatutDemande, RoleUtilisateur


# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    role: RoleUtilisateur
    exp: int


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    nom: Optional[str] = None
    prenom: Optional[str] = None
    role: RoleUtilisateur = RoleUtilisateur.CLIENT
    nom_entreprise: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    nom: Optional[str]
    prenom: Optional[str]
    role: RoleUtilisateur

    class Config:
        from_attributes = True


# Annonce/Bien
class AdresseIn(BaseModel):
    ligne1: str
    ligne2: Optional[str] = None
    ville: str
    code_postal: str
    pays: str


class PhotoIn(BaseModel):
    url: str
    ordre: int = 0
    legende: Optional[str] = None


class BienIn(BaseModel):
    reference: str
    surface_m2: float
    nombre_pieces: int
    type_bien: TypeBien
    classe_energetique: Optional[str] = None
    annee_construction: Optional[int] = None
    adresse: AdresseIn
    photos: List[PhotoIn] = []


class AnnonceCreate(BaseModel):
    titre: str
    description: str
    type_transaction: TypeTransaction
    prix: float
    bien: BienIn


class AnnonceFilter(BaseModel):
    type_transaction: Optional[TypeTransaction] = None
    type_bien: Optional[TypeBien] = None
    prix_min: Optional[float] = None
    prix_max: Optional[float] = None
    ville: Optional[str] = None


class PhotoOut(BaseModel):
    id: int
    url: str
    ordre: int
    legende: Optional[str]

    class Config:
        from_attributes = True


class AdresseOut(BaseModel):
    ligne1: str
    ligne2: Optional[str]
    ville: str
    code_postal: str
    pays: str

    class Config:
        from_attributes = True


class BienOut(BaseModel):
    id: int
    reference: str
    surface_m2: float
    nombre_pieces: int
    type_bien: TypeBien
    classe_energetique: Optional[str]
    annee_construction: Optional[int]
    adresse: AdresseOut
    photos: List[PhotoOut]

    class Config:
        from_attributes = True


class AnnonceOut(BaseModel):
    id: int
    titre: str
    description: str
    type_transaction: TypeTransaction
    prix: float
    date_publication: datetime
    etat: EtatAnnonce
    visites_compteur: int
    favoris_compteur: int
    bien: BienOut
    entreprise_id: int

    class Config:
        from_attributes = True


# Demande
class DemandeCreate(BaseModel):
    annonce_id: int
    type_transaction: TypeTransaction
    message: Optional[str] = None


class DemandeOut(BaseModel):
    id: int
    date_demande: datetime
    statut: StatutDemande
    type_transaction: TypeTransaction
    message: Optional[str]
    annonce_id: int
    client_id: int
    entreprise_id: int

    class Config:
        from_attributes = True


class DemandeSetStatut(BaseModel):
    statut: StatutDemande