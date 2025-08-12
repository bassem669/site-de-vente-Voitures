from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from .database import get_session
from .auth import decode_token
from .models import Utilisateur, RoleUtilisateur


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(session: SessionDep, token: TokenDep) -> Utilisateur:
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = session.exec(select(Utilisateur).where(Utilisateur.email == payload.sub)).first()
    if user is None or not user.actif:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive or missing user")
    return user


def require_role(required: RoleUtilisateur):
    def _role_dependency(current_user: Utilisateur = Depends(get_current_user)) -> Utilisateur:
        if current_user.role != required:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user

    return _role_dependency