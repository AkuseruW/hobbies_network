import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Session } from '@/types/sessions_types';

const UserInformation = ({ currentUser }: { currentUser: Session }) => {
    return (
        <div className="flex items-center mb-4">
            <Avatar className="mr-2">
                <AvatarImage
                    src={`${currentUser.profile_picture}`}
                    alt={`${currentUser.firstname}`}
                />
            </Avatar>
            <div>
                <p className="text-sm font-medium">
                    {currentUser.firstname} {currentUser.lastname}
                </p>
            </div>
        </div>
    );
};

export default UserInformation;
