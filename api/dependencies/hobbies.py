from models import Hobby


def get_hobby_by_slug(db, hobby_slug):
    return db.query(Hobby).filter(Hobby.slug == hobby_slug).first()


def update_hobby_fields(hobby, name, description, slug):
    if name:
        hobby.name = name
    if description:
        hobby.description = description
    if slug:
        hobby.slug = slug
    return hobby
