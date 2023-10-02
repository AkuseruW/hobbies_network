import imghdr
from fastapi import UploadFile, HTTPException
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dsvvipx0f",
    api_key="419736286916279",
    api_secret="D6m6g-Z_hux_FUj_Z2uSl6-_o7s"
)

# Define allowed directories
ALLOWED_DIRECTORIES = {"profil", "post", "hobby"}

# Limit the maximum file size to 5MB (adjust as needed)
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024


async def upload_image_to_cloudinary(file: UploadFile, directory: str):
    if directory not in ALLOWED_DIRECTORIES:
        raise ValueError("Invalid directory")

    # Validate file extension and contents
    image_format = imghdr.what(file.filename, await file.read(1024))
    if image_format not in {"jpeg", "png", "gif"}:
        raise HTTPException(
            status_code=400, detail="Format de l'image invalide")

    # Reset file read position after validation
    file.file.seek(0)

    # Limit file size
    if file.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413, detail="La taille de l'image ne doit pas dépasser 5 Mo.")

    response = cloudinary.uploader.upload(
        file.file, upload_preset=f"{directory}")
    return response


async def delete_image(public_id):
    cloudinary.uploader.destroy(public_id)
    return


async def upload_hobby_svg(white: UploadFile, black: UploadFile):
    if white.size > MAX_FILE_SIZE_BYTES or black.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size is too large")

    response_white = cloudinary.uploader.upload(
        white.file, upload_preset="hobby")
    response_black = cloudinary.uploader.upload(
        black.file, upload_preset="hobby")

    return {
        "white": {"public_id": response_white["public_id"], "secure_url": response_white["secure_url"]},
        "black": {"public_id": response_black["public_id"], "secure_url": response_black["secure_url"]}
    }
