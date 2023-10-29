import json
from fastapi import APIRouter, Depends, Request, Query, HTTPException
from models import Hobby, User, ProposedHobby
from dependencies.auth import get_current_active_user
from settings.database import get_session
from sqlalchemy.orm import Session
from dependencies.uploads import (
    delete_image,
    upload_image_to_cloudinary,
    upload_hobby_svg,
)
from dependencies.hobbies import get_hobby_by_slug, update_hobby_fields

router = APIRouter(
    prefix="/api", tags=["hobbies"], dependencies=[Depends(get_current_active_user)]
)


class HobbyQueryParams:
    def __init__(
        self,
        page: int = Query(1, description="page"),
        per_page: int = Query(10, description="per_page"),
        search: str = Query(None, description="search"),
        q: str = Query(None, description="q"),
    ):
        self.page = page
        self.per_page = per_page
        self.search = search
        self.q = q


@router.get("/all_hobbies", response_model=dict)
def get_hobbies(
    params: HobbyQueryParams = Depends(),
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
) -> dict:
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
        hobbies_query = hobbies_query.filter(Hobby.name.ilike(f"%{params.search}%"))

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
            "added": hobby.id in user_hobbies,
        }
        hobbies_data.append(hobby_data)
        
    # check if the end of the list
    is_end_of_list = (params.page * params.per_page) >= total_hobbies

    return {"hobbies": hobbies_data, "totalPages": total_pages, "is_end_of_list": is_end_of_list}


@router.get("/proposed_hobbies")
def get_proposed_hobbies(
    params: HobbyQueryParams = Depends(),
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, 
            detail="You are not authorized to perform this action."
        )
    
    offset = (params.page - 1) * params.per_page
    total_hobbies = db.query(Hobby).count()
    total_pages = (total_hobbies + params.per_page - 1) // params.per_page
    hobbies_query = db.query(ProposedHobby)

    if params.search:
        hobbies_query = hobbies_query.filter(ProposedHobby.name.ilike(f"%{params.search}%"))        
    
    hobbies = hobbies_query.offset(offset).limit(params.per_page).all()
    
    return {"hobbies": hobbies, "totalPages": total_pages}


@router.get("/user_hobbies")
def get_user_hobbies(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    # Query the database to find the current user
    user = db.query(User).filter(User.id == current_user.id).first()
    # Get the list of hobbies associated with the user
    hobbies = [hobby.hobby for hobby in user.hobbies]
    return hobbies


@router.post("/new_hobby")
async def create_hobby(request: Request, db: Session = Depends(get_session)):
    # Get form data from the request
    form_data = await request.form()
    name = form_data.get("name")
    description = form_data.get("description")
    slug = form_data.get("slug")
    black = form_data.get("black")
    white = form_data.get("white")

    # Upload hobby SVG images
    uploaded_banner = await upload_hobby_svg(white, black)
    # Create a new Hobby object with the provided data
    hobby = Hobby(
        name=name,
        public_id_black=uploaded_banner["black"]["public_id"],
        public_id_white=uploaded_banner["white"]["public_id"],
        icone_black=uploaded_banner["black"]["secure_url"],
        icone_white=uploaded_banner["white"]["secure_url"],
        description=description,
        slug=slug,
    )
    # Add the hobby to the database within a transaction
    db.add(hobby)

    return {"message": "Hobby created successfully"}


@router.patch("/hobby_update/{hobby_slug}")
async def update_hobby(
    hobby_slug: str,
    request: Request,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    # Check if the current user is an admin, and if not, raise a 403 Forbidden error
    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, 
            detail="You are not authorized to perform this action."
        )

    # Get form data from the request
    form_data = await request.form()
    name = form_data.get("name")
    description = form_data.get("description")
    slug = form_data.get("slug")
    banner = form_data.get("banner")
    # Get form data from the request
    hobby = get_hobby_by_slug(db, hobby_slug)
    # If the hobby doesn't exist, raise a 404 Not Found error
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")

    if banner:
        # If a new banner is provided and the hobby already has a banner, delete the old banner
        if hobby.banner:
            if not await delete_image(hobby.public_id, "hobby"):
                raise HTTPException(
                    status_code=500,
                    detail="Failed to delete old banner image"
                )

        # Upload the new banner image
        uploaded_banner = await upload_image_to_cloudinary(
            file=banner, directory="hobby"
        )
        hobby.public_id = uploaded_banner["public_id"]
        hobby.url = (uploaded_banner["secure_url"],)
        hobby.width = (uploaded_banner["width"],)
        hobby.height = uploaded_banner["height"]

    # Update hobby fields
    update_hobby_fields(hobby, name, description, slug)

    db.commit()
    db.refresh(hobby)

    return {"success": True, "message": "Hobby updated successfully"}


@router.delete("/hobby/{hobby_slug}")
async def delete_hobby(
    hobby_slug: str,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    # Check if the current user is an admin, and if not, raise a 403 Forbidden error
    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    # Query the database to find the hobby with the given slug
    hobby = db.query(Hobby).filter(Hobby.slug == hobby_slug).first()
    # If the hobby doesn't exist, raise a 404 Not Found error
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")

    db.delete(hobby)
    db.commit()

    return {"success": True, "message": "Hobby deleted successfully"}


@router.delete("/hobby_suggest/{hobby_id}")
async def delete_hobby_suggest(
    hobby_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    # Check if the current user is an admin, and if not, raise a 403 Forbidden error
    if current_user.user_role != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    # Query the database to find the hobby with the given slug
    hobby_suggest = db.query(ProposedHobby).filter(ProposedHobby.id == hobby_id).first()
    # If the hobby doesn't exist, raise a 404 Not Found error
    if not hobby_suggest:
        raise HTTPException(status_code=404, detail="Hobby not found")

    db.delete(hobby_suggest)
    db.commit()

    return {"success": True, "message": "Hobby deleted successfully"}

@router.get("/hobby/{hobby_slug}")
async def get_hobby(hobby_slug: str, db: Session = Depends(get_session)):
    # Find the hobby with the given slug
    hobby = db.query(Hobby).filter(Hobby.slug == hobby_slug).first()
    # If the hobby doesn't exist, raise a 404 Not Found error
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")

    return hobby


@router.post("/propose_hobby")
async def propose_hobby(
    request: Request,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
):
    # Get the request body data
    data = await request.body()
    json_data = json.loads(data)
    # Create a ProposedHobby object with the user's ID, name, and description
    propose_hobby = ProposedHobby(
        user_id=current_user.id,
        name=json_data["name"],
        description=json_data["description"] if "description" in json_data else "",
    )

    db.add(propose_hobby)
    db.commit()

    return {"message": "Le Hobby a été proposé avec succès"}
