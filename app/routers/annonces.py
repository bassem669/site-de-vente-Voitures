from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from ..database import get_session

from ..deps import get_current_user, require_role
from ..models import (
    Annonce,
    BienImmobilier,
    Photo,
    Adresse,
    Utilisateur,
    RoleUtilisateur,
    EtatAnnonce,
)
from ..schemas import AnnonceOut, AnnonceCreate

router = APIRouter(prefix="/annonces", tags=["annonces"])


@router.get("/", response_model=List[AnnonceOut])
def list_annonces(
    session: Session = Depends(get_session),
    type_transaction: Optional[str] = Query(default=None),
    type_bien: Optional[str] = Query(default=None),
    prix_min: Optional[float] = Query(default=None, ge=0),
    prix_max: Optional[float] = Query(default=None, ge=0),
    ville: Optional[str] = Query(default=None),
):
    session: Session = session  # type: ignore[no-redef]
    statement = select(Annonce).where(Annonce.etat == EtatAnnonce.PUBLIEE)
    if type_transaction:
        statement = statement.where(Annonce.type_transaction == type_transaction)
    if prix_min is not None:
        statement = statement.where(Annonce.prix >= prix_min)
    if prix_max is not None:
        statement = statement.where(Annonce.prix <= prix_max)
    if type_bien:
        statement = statement.join(Annonce.bien).where(BienImmobilier.type_bien == type_bien)
    if ville:
        statement = statement.join(Annonce.bien).join(BienImmobilier.adresse).where(Adresse.ville.ilike(f"%{ville}%"))

    results = session.exec(statement).all()
    return results


@router.get("/{annonce_id}", response_model=AnnonceOut)
def get_annonce(annonce_id: int, session: Session = Depends(get_session)):
    annonce = session.get(Annonce, annonce_id)
    if not annonce or annonce.etat != EtatAnnonce.PUBLIEE:
        raise HTTPException(status_code=404, detail="Annonce introuvable")
    annonce.visites_compteur += 1
    session.add(annonce)
    session.commit()
    session.refresh(annonce)
    return annonce


@router.post("/", response_model=AnnonceOut, dependencies=[Depends(require_role(RoleUtilisateur.ENTREPRISE))])
def create_annonce(
    payload: AnnonceCreate,
    current_user: Utilisateur = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not current_user.entreprise:
        raise HTTPException(status_code=400, detail="Compte entreprise requis")

    adresse = Adresse(
        ligne1=payload.bien.adresse.ligne1,
        ligne2=payload.bien.adresse.ligne2,
        ville=payload.bien.adresse.ville,
        code_postal=payload.bien.adresse.code_postal,
        pays=payload.bien.adresse.pays,
    )
    session.add(adresse)
    session.flush()

    bien = BienImmobilier(
        reference=payload.bien.reference,
        surface_m2=payload.bien.surface_m2,
        nombre_pieces=payload.bien.nombre_pieces,
        type_bien=payload.bien.type_bien,
        classe_energetique=payload.bien.classe_energetique,
        annee_construction=payload.bien.annee_construction,
        adresse_id=adresse.id,
    )
    session.add(bien)
    session.flush()

    annonce = Annonce(
        titre=payload.titre,
        description=payload.description,
        type_transaction=payload.type_transaction,
        prix=payload.prix,
        entreprise_id=current_user.entreprise.id,  # type: ignore
        bien_id=bien.id,  # type: ignore
        etat=EtatAnnonce.PUBLIEE if current_user.entreprise.verifiee else EtatAnnonce.BROUILLON,
    )
    session.add(annonce)
    session.flush()

    for p in payload.bien.photos:
        session.add(Photo(url=p.url, ordre=p.ordre, legende=p.legende, bien_id=bien.id))  # type: ignore

    session.commit()
    session.refresh(annonce)
    return annonce


@router.patch("/{annonce_id}", response_model=AnnonceOut, dependencies=[Depends(require_role(RoleUtilisateur.ENTREPRISE))])
def update_annonce(
    annonce_id: int,
    titre: Optional[str] = None,
    description: Optional[str] = None,
    prix: Optional[float] = None,
    etat: Optional[EtatAnnonce] = None,
    current_user: Utilisateur = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    annonce = session.get(Annonce, annonce_id)
    if not annonce:
        raise HTTPException(status_code=404, detail="Annonce introuvable")
    if annonce.entreprise_id != (current_user.entreprise.id if current_user.entreprise else None):
        raise HTTPException(status_code=403, detail="Non autorisé")

    if titre is not None:
        annonce.titre = titre
    if description is not None:
        annonce.description = description
    if prix is not None:
        annonce.prix = prix
    if etat is not None:
        annonce.etat = etat

    session.add(annonce)
    session.commit()
    session.refresh(annonce)
    return annonce


@router.delete("/{annonce_id}", status_code=204, dependencies=[Depends(require_role(RoleUtilisateur.ENTREPRISE))])
def delete_annonce(
    annonce_id: int,
    current_user: Utilisateur = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    annonce = session.get(Annonce, annonce_id)
    if not annonce:
        raise HTTPException(status_code=404, detail="Annonce introuvable")
    if annonce.entreprise_id != (current_user.entreprise.id if current_user.entreprise else None):
        raise HTTPException(status_code=403, detail="Non autorisé")
    session.delete(annonce)
    session.commit()
    return None