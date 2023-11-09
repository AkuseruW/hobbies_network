from fastapi import APIRouter, HTTPException, Depends, Request
from sockets import ws_manager
from sqlalchemy.orm import Session
from settings.database import get_session
from models import Post, User, Hobby, PostImage
from models.schemas.postSchemas import PostSchemaCreated

# Dependencies
from dependencies.post import get_posts, post_to_database, get_post_by_hobby
from dependencies.auth import get_current_active_user
from dependencies.uploads import delete_image


router = APIRouter(
    prefix="/api", tags=["posts"], dependencies=[Depends(get_current_active_user)])


@router.get("/posts")
async def read_posts(page: int = 1, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    posts = await get_posts(current_user, page, db) # Get posts
    return posts


@router.get("/posts/{hobby_slug}")
async def read_hobby_posts(hobby_slug: str, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    hobby = db.query(Hobby).filter(Hobby.slug == hobby_slug).first()
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    posts = await get_post_by_hobby(current_user, hobby.id, db)
    return posts


@router.post("/post", response_model=PostSchemaCreated)
async def create_post(request: Request, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    user = current_user
    form_data = await request.form()
    user_id = user.id
    content = form_data.get('content')
    images = form_data.getlist('images')
    hobby_id = form_data.get('hobby_id')
    
    
    if not content or not hobby_id:
        # Check if content and hobby_id are provided, and if not, raise an HTTP 400 Bad Request exception.
        raise HTTPException(status_code=400, detail="Tous les champs requis doivent être remplis.")
    
    # Create a new post and add it to the database
    new_post = await post_to_database(db, content, user_id, images, hobby_id)
    
    # Prepare data for the new post
    new_posts_data = {
        'id': str(new_post.id),
        'content': new_post.content,
        'post_images_urls': [image.url for image in new_post.post_images],
        'total_comments': new_post.total_comments(),
        'total_likes': new_post.total_likes(),
        'created_at': new_post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        'hobby': {
            'hobby_id': new_post.hobby.id,
            'name': new_post.hobby.name,
            'slug': new_post.hobby.slug,
        },
        'user': {
            'user_id': new_post.user_id,
            'username': new_post.user_name(),
            'is_certified': new_post.is_certified(),
            'profile_picture': new_post.user_profile_picture(),
        }
    }
    # Send the new post to followers using a WebSocket manager
    await ws_manager.send_new_post_to_followers(new_posts_data, hobby_id, user_id, db)
    return new_post


@router.get("/post/{post_id}", response_model=None)
async def get_post_by_id(post_id: str, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    user = db.query(User).get(current_user.id)  # Get the user by ID

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if the current user has liked this post
    has_liked = post.id in {liked_post.id for liked_post in user.liked_posts}

    # Return the Post object with the 'userHasLiked' field
    return {
        'id': str(post.id),
        'content': post.content,
        'user_name': post.user_name(),
        'post_images_urls': post.post_images_urls,
        'created_at': post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        'userHasLiked': has_liked,
        'user': {
            'user_id': post.user_id,
            'username': post.user_name(),
            'is_certified': post.is_certified(),
            'profile_picture': post.user_profile_picture(),
        }
    }


@router.post('/post_like/{post_id}', response_model=None)
async def like_or_dislike_post(post_id: str, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    post = db.query(Post).filter_by(id=post_id).first()

    existing_like = next(
        (like for like in post.likes if like.id == current_user.id), None)

    if existing_like:
        # Remove the like
        post.likes.remove(existing_like)
        # Decrease likes count
        post.remove_like(existing_like)
        await ws_manager.send_post_events({"type": "post_liked_removed", "data": {'post_id': post_id}})

    else:
        # User has not liked the post, so add the like
        user = db.query(User).filter_by(id=current_user.id).first()
        if not user:
            raise HTTPException(status_code=404, detail='User not found')

        post.likes.append(user)
        # Increase the likes count
        post.add_like(user)
        await ws_manager.send_post_events({"type": "post_liked", "data": {'post_id': post_id}})

    db.commit()
    db.close()

    return {'message': 'Like status updated successfully'}


@router.delete("/post/{post_id}")
async def delete_post(post_id: str, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        # If the post is not found, raise an HTTP 404 Not Found exception
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id and current_user.user_role != "ROLE_ADMIN":
        # Check if the current user has permission to delete the post, if not, raise an HTTP 403 Forbidden exception
        raise HTTPException(
            status_code=403, detail="You don't have permission to delete this post")

    if post:
        # If the post exists, delete associated images from Cloudinary and the database
        post_images = db.query(PostImage).filter(
            PostImage.post_id == post_id).all()
        if post_images:
            # Delete images from Cloudinary and database
            for post_image in post_images:
                await delete_image(public_id=post_image.public_id)

        db.delete(post)
        db.commit()

    await ws_manager.send_post_events({"type": "post_deleted", "data": post_id})
    return {"message": "Post deleted successfully"}


@router.patch("/post/{post_id}")
async def update_post(post_id: str, request: Request, db: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    # Retrieve the post from the database based on post_id
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        # If the post is not found, raise an HTTP 404 Not Found exception
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        # Check if the current user has permission to update this post, if not, raise an HTTP 403 Forbidden exception
        raise HTTPException(
            status_code=403, detail="You don't have permission to update this post")

    form_data = await request.form()
    content = form_data.get("content")
    hobby_id = form_data.get("hobby_id")

    # Update the post content and hobby_id if provided
    if content:
        post.content = content
    if hobby_id:
        post.hobby_id = hobby_id
