from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ..auth import get_password_hash, verify_password, create_access_token
from ..database import get_session
from ..deps import get_current_user
from ..models import Utilisateur, RoleUtilisateur, Entreprise
from ..schemas import UserCreate, UserOut, Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut)
def signup(payload: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(Utilisateur).where(Utilisateur.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    user = Utilisateur(
        email=payload.email,
        mot_de_passe_hash=get_password_hash(payload.password),
        nom=payload.nom,
        prenom=payload.prenom,
        role=payload.role,
    )
    session.add(user)
    session.flush()  # get user.id

    if payload.role == RoleUtilisateur.ENTREPRISE:
        if not payload.nom_entreprise:
            raise HTTPException(status_code=400, detail="nom_entreprise requis pour un compte Entreprise")
        entreprise = Entreprise(nom_entreprise=payload.nom_entreprise, responsable_id=user.id)
        session.add(entreprise)

    session.commit()
    session.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(Utilisateur).where(Utilisateur.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.mot_de_passe_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides")
    token = create_access_token(subject=user.email, role=user.role.value)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: Utilisateur = Depends(get_current_user)):
    return current_user