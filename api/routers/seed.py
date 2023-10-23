from fastapi import APIRouter, Depends, Header, Request
from faker import Faker
from sqlalchemy.orm import Session
from settings.database import get_session
from dependencies.auth import get_password_hash
from models import User, Role


router = APIRouter(prefix="/api", tags=["seed"])

fake = Faker()

predefined_hobbies = [
    ("Lecture", "Profitez d'une bonne lecture avec vos auteurs préférés.", "lecture.jpg"),
    ("Voyage", "Découvrez de nouvelles destinations et explorez le monde.", "voyage.jpg"),
    ("Peinture", "Laissez libre cours à votre créativité en peignant de magnifiques œuvres d'art.", "peinture.jpg"),
    ("Cuisine", "Préparez des plats délicieux et explorez les saveurs de différentes cuisines.", "cuisine.jpg"),
    ("Randonnée", "Parcourez les sentiers de montagne et profitez de la beauté de la nature.", "randonnee.jpg"),
    ("Musique", "Exprimez-vous en jouant d'un instrument de musique ou en écoutant vos morceaux préférés.", "musique.jpg"),
    ("Jardinage", "Cultivez et entretenez votre jardin pour faire pousser de belles plantes et fleurs.", "jardinage.jpg"),
    ("Sport", "Restez actif et en forme en pratiquant votre sport favori.", "sport.jpg"),
    ("Photographie", "Capturez des moments spéciaux avec votre appareil photo et développez vos compétences en photographie.", "photographie.jpg"),
    ("Danse", "Laissez-vous emporter par la musique et exprimez-vous à travers la danse.", "danse.jpg"),
    ("Cinéma", "Détendez-vous en regardant des films et explorez différents genres cinématographiques.", "cinema.jpg"),
    ("Jeux vidéo", "Plongez dans des mondes virtuels et découvrez des aventures passionnantes grâce aux jeux vidéo.", "jeux_video.jpg")
]

@router.post("/create_data")
def create_user(session: Session = Depends(get_session)):

    # Create 10 users
    for _ in range(10):
        # Generate fake user data
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.email()
        bio = fake.text()
        hashed_password = get_password_hash(fake.password())
        new_user = User(
            email=email,
            password=hashed_password,
            firstname=first_name,
            lastname=last_name,
            bio=bio,
            role = Role.ROLE_USER
        )

        # Create user
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        
        
        
