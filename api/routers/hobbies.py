from fastapi import APIRouter, Depends, Request, Query, HTTPException
from slugify import slugify
from models import Hobby, User
from dependencies.auth import get_current_active_user
from models.schemas.hobbyScheamas import NewHobby
from settings.database import get_session
from sqlalchemy.orm import Session, joinedload
from dependencies.uploads import delete_image, upload_image_to_cloudinary, upload_hobby_svg
from seeds.hobby import predefined_hobbies
from dependencies.hobbies import get_hobby_by_slug, update_hobby_fields
from typing import Dict, List, Union


# Create an APIRouter instance with a prefix and tags
router = APIRouter(
    prefix="/api", tags=["hobbies"], dependencies=[Depends(get_current_active_user)])


# Define a Pydantic model for query parameters
class HobbyQueryParams:
    def __init__(self, page: int = Query(1, description="page"), per_page: int = Query(10, description="per_page"), search: str = Query(None, description="search")):
        self.page = page
        self.per_page = per_page
        self.search = search


@router.get("/all_hobbies", response_model=dict)
def get_hobbies(params: HobbyQueryParams = Depends(), db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)) -> dict:
    # Calculate offset and total pages
    offset = (params.page - 1) * params.per_page
    total_hobbies = db.query(Hobby).count()
    total_pages = (total_hobbies + params.per_page - 1) // params.per_page

    # Query hobbies with joined users
    user = db.query(User).filter(User.id == current_user.id).one_or_none()

    # Access the hobbies associated with the user
    user_hobbies = [user_to_hobby.hobby.id for user_to_hobby in user.hobbies]

    hobbies_query = db.query(Hobby)

    if params.search:
        hobbies_query = hobbies_query.filter(
            Hobby.name.ilike(f"%{params.search}%"))

    hobbies = hobbies_query.offset(offset).limit(params.per_page).all()

    hobbies_data = []
    for hobby in hobbies:
        hobby_data = {
            "id": hobby.id,
            "name": hobby.name,
            "icone_black": hobby.icone_black,
            "icone_white": hobby.icone_white,
            "description": hobby.description,
            "slug": hobby.slug,
            'added': hobby.id in user_hobbies
        }
        hobbies_data.append(hobby_data)

    return {"hobbies": hobbies_data, "totalPages": total_pages}


# Define a route to get the list of hobbies for the current user
@router.get("/user_hobbies")
def get_user_hobbies(db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    hobbies = [hobby.hobby for hobby in user.hobbies]
    return hobbies


# Define a route to create a new hobby
@router.post("/new_hobby")
async def create_hobby(request: Request, db: Session = Depends(get_session)):
    form_data = await request.form()
    name = form_data.get("name")
    description = form_data.get("description")
    slug = form_data.get("slug")
    black = form_data.get("black")
    white = form_data.get("white")

    # Upload hobby SVG images
    uploaded_banner = await upload_hobby_svg(white, black)

    hobby = Hobby(
        name=name,
        public_id_black=uploaded_banner["black"]["public_id"],
        public_id_white=uploaded_banner["white"]["public_id"],
        icone_black=uploaded_banner["black"]["secure_url"],
        icone_white=uploaded_banner["white"]["secure_url"],
        description=description,
        slug=slug,
    )

    with db.begin():
        db.add(hobby)

    return {"message": "Hobby created successfully"}


# Define a route to update an existing hobby
@router.patch("/hobby/{hobby_slug}")
async def update_hobby(hobby_slug: str, request: Request, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):

    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action.")

    form_data = await request.form()
    name = form_data.get("name")
    description = form_data.get("description")
    slug = form_data.get("slug")
    banner = form_data.get("banner")

    hobby = get_hobby_by_slug(db, hobby_slug)
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")

    if banner:
        if hobby.banner:
            if not await delete_image(hobby.public_id, "hobby"):
                raise HTTPException(
                    status_code=500, detail="Failed to delete old banner image")

        # Upload the new banner image
        uploaded_banner = await upload_image_to_cloudinary(file=banner, directory="hobby")
        hobby.public_id = uploaded_banner["public_id"]
        hobby.url = uploaded_banner["secure_url"],
        hobby.width = uploaded_banner["width"],
        hobby.height = uploaded_banner["height"]

    # Update hobby fields
    update_hobby_fields(hobby, name, description, slug)

    with db.begin():
        db.commit()

    return {"message": "Hobby updated successfully"}


# Define a route to delete a hobby
@router.delete("/hobby/{hobby_slug}")
async def delete_hobby(hobby_slug: str, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):

    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action.")

    hobby = db.query(Hobby).filter(Hobby.slug == hobby_slug).first()

    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")

    db.delete(hobby)
    db.commit()

    return {"message": "Hobby deleted successfully"}


# Define a route to get a hobby by its slug
@router.get("/hobby/{hobby_slug}")
async def get_hobby(hobby_slug: str, db: Session = Depends(get_session)):
    hobby = db.query(Hobby).filter(Hobby.slug == hobby_slug).first()

    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")

    return hobby
