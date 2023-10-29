from fastapi import Depends, HTTPException
from models import Post, PostImage, User
from sqlalchemy.orm import Session
from settings.database import get_session
from sqlalchemy import desc
from dependencies.uploads import upload_image_to_cloudinary


def create_post_info_dict(post, liked_post_ids):
    post_info = {
        'id': str(post.id),
        'content': post.content,
        'post_images_urls': post.post_images_urls,
        'total_comments': post.total_comments(),
        'total_likes': post.total_likes(),
        'created_at': post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        'userHasLiked': post.id in liked_post_ids,
    }

    if post.hobby:
        post_info['hobby'] = {
            'hobby_id': post.hobby.id,
            'name': post.hobby.name,
            'slug': post.hobby.slug
        }
    else:
        post_info['hobby'] = None

    post_info['user'] = {
        'user_id': post.user_id,
        'username': post.user_name(),
        'is_certified': post.is_certified(),
        'profile_picture': post.user_profile_picture(),
    }

    return post_info


async def get_posts(current_user: User, page: int = 1, db: Session = Depends(get_session)):
    user = db.query(User).get(current_user.id)  # Get the user by ID
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get the IDs of hobbies
    selected_hobby_ids = [hobby.hobby_id for hobby in user.hobbies]
    # Get the IDs of posts the user has liked
    liked_post_ids = {post.id for post in user.liked_posts}
    # Get the IDs of followers
    followers = [follower.id for follower in user.following_list]

    # Pagination
    per_page = 10
    offset = (page - 1) * per_page

    posts_query = (
        db.query(Post)
        .filter(
            (Post.hobby_id.in_(selected_hobby_ids))
            | (Post.user_id.in_(followers))
            | (Post.user_id == current_user.id)
        )
        .order_by(desc(Post.created_at))
    )

    total_posts = posts_query.count()
    posts = posts_query.slice(offset, offset + per_page).all()

    filtered_posts_data = [create_post_info_dict(post, liked_post_ids) for post in posts]

    # check if the end of the list
    is_end_of_list = (page * per_page) >= total_posts

    return {"posts": filtered_posts_data, "is_end_of_list": is_end_of_list}


async def post_to_database(db, content, user_id, images, hobby_id):
    # Create a new Post object
    new_post = Post(content=content, user_id=user_id, hobby_id=hobby_id)
    # Create PostImage objects if images are present
    if images:
        for image in images:
            file = await upload_image_to_cloudinary(file=image, directory="post")
            new_image = PostImage(public_id=file["public_id"],
                                  url=file["secure_url"], width=file["width"],
                                  height=file["height"])
            new_post.post_images.append(new_image)

    # Add the new_post to the database
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


async def get_post_by_hobby(current_user: User, hobby_id: int, db: Session = Depends(get_session)):
    posts = db.query(Post).filter(Post.hobby_id == hobby_id).order_by(
        desc(Post.created_at)).all()

    user = db.query(User).get(current_user.id)  # Get the user by ID
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    liked_post_ids = {post.id for post in user.liked_posts}

    posts_data = [create_post_info_dict(
        post, liked_post_ids) for post in posts]

    return posts_data
