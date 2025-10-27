from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func

from ..database import get_session

from ..deps import get_current_user, require_role
from ..models import Utilisateur, RoleUtilisateur, Entreprise, Annonce, Demande, EtatAnnonce

router = APIRouter(prefix="/entreprises", tags=["entreprises"])


@router.get("/me/stats")
def stats_me(current_user: Utilisateur = Depends(require_role(RoleUtilisateur.ENTREPRISE)), session: Session = Depends(get_session)):
    current_user = current_user  # type: ignore[no-redef]
    if not current_user.entreprise:
        raise HTTPException(status_code=400, detail="Compte entreprise requis")

    entreprise_id = current_user.entreprise.id  # type: ignore

    nb_annonces = session.exec(select(func.count()).select_from(Annonce).where(Annonce.entreprise_id == entreprise_id)).one()
    nb_annonces_pub = session.exec(
        select(func.count()).select_from(Annonce).where(Annonce.entreprise_id == entreprise_id, Annonce.etat == EtatAnnonce.PUBLIEE)
    ).one()
    nb_demandes = session.exec(select(func.count()).select_from(Demande).where(Demande.entreprise_id == entreprise_id)).one()

    return {
        "annonces_total": nb_annonces[0] if isinstance(nb_annonces, tuple) else nb_annonces,
        "annonces_publiees": nb_annonces_pub[0] if isinstance(nb_annonces_pub, tuple) else nb_annonces_pub,
        "demandes_total": nb_demandes[0] if isinstance(nb_demandes, tuple) else nb_demandes,
    }