from Models.Proffessor import Proffessor
from Models.Classes import Classes
from Routes import professor_route
from Routes import classes_route
from fastapi import FastAPI
from Database.connection import engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restreins en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(professor_route.router)
app.include_router(classes_route.router)