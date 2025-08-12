from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session

from ..deps import get_current_user, require_role
from ..models import Utilisateur, Demande, Annonce, Entreprise, StatutDemande, RoleUtilisateur, EtatAnnonce
from ..schemas import DemandeCreate, DemandeOut, DemandeSetStatut

router = APIRouter(prefix="/demandes", tags=["demandes"])


@router.post("/", response_model=DemandeOut, dependencies=[Depends(require_role(RoleUtilisateur.CLIENT))])
def creer_demande(payload: DemandeCreate, current_user: Utilisateur = Depends(get_current_user), session: Session = Depends(get_session)):
    annonce = session.get(Annonce, payload.annonce_id)
    if not annonce or annonce.etat != EtatAnnonce.PUBLIEE:
        raise HTTPException(status_code=404, detail="Annonce introuvable")

    demande = Demande(
        type_transaction=payload.type_transaction,
        message=payload.message,
        client_id=current_user.id,  # type: ignore
        annonce_id=annonce.id,  # type: ignore
        entreprise_id=annonce.entreprise_id,
    )
    session.add(demande)
    session.commit()
    session.refresh(demande)
    return demande


@router.get("/mes", response_model=List[DemandeOut], dependencies=[Depends(require_role(RoleUtilisateur.CLIENT))])
def mes_demandes(current_user: Utilisateur = Depends(get_current_user), session: Session = Depends(get_session)):
    results = session.exec(select(Demande).where(Demande.client_id == current_user.id)).all()
    return results


@router.get("/recues", response_model=List[DemandeOut], dependencies=[Depends(require_role(RoleUtilisateur.ENTREPRISE))])
def demandes_recues(current_user: Utilisateur = Depends(get_current_user), session: Session = Depends(get_session)):
    if not current_user.entreprise:
        raise HTTPException(status_code=400, detail="Compte entreprise requis")
    results = session.exec(select(Demande).where(Demande.entreprise_id == current_user.entreprise.id)).all()  # type: ignore
    return results


@router.patch("/{demande_id}/statut", response_model=DemandeOut, dependencies=[Depends(require_role(RoleUtilisateur.ENTREPRISE))])
def set_statut_demande(
    demande_id: int,
    payload: DemandeSetStatut,
    current_user: Utilisateur = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    demande = session.get(Demande, demande_id)
    if not demande:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    if not current_user.entreprise or demande.entreprise_id != current_user.entreprise.id:
        raise HTTPException(status_code=403, detail="Non autorisé")

    if payload.statut not in {StatutDemande.ACCEPTEE, StatutDemande.REFUSEE, StatutDemande.ANNULEE}:
        raise HTTPException(status_code=400, detail="Statut invalide pour cette action")

    demande.statut = payload.statut
    session.add(demande)
    session.commit()
    session.refresh(demande)
    return demande