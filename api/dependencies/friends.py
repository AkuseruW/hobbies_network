from models.Follower import  FriendRelation
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session


def are_users_friends(user_id_1: int, user_id_2: int, db: Session) -> bool:
    friend_relation = db.query(FriendRelation).filter(
        or_(
            and_(FriendRelation.user_id_1 == user_id_1, FriendRelation.user_id_2 == user_id_2),
            and_(FriendRelation.user_id_1 == user_id_2, FriendRelation.user_id_2 == user_id_1)
        )
    ).first()
    return friend_relation is not None