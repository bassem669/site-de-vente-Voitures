from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from .config import settings
from .database import init_db, get_session
from .routers import auth as auth_router
from .routers import annonces as annonces_router
from .routers import demandes as demandes_router
from .routers import entreprises as entreprises_router

app = FastAPI(title=settings.app_name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()



app.include_router(auth_router.router)
app.include_router(annonces_router.router)
app.include_router(demandes_router.router)
app.include_router(entreprises_router.router)


@app.get("/")
def healthcheck(session: Session = Depends(get_session)):
    return {"status": "ok"}