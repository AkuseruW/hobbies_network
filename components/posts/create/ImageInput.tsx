import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageInputProps {
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const ImageInput: React.FC<ImageInputProps> = ({ handleImageChange }) => {
    return (
        <div className="items-center px-2 py-2">
            <label htmlFor="image-input" >
                <PhotoIcon className="w-8 h-8 cursor-pointer" />
            </label>
            <input
                id="image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden hover:bg-blue-60"
            />
        </div>
    );
};

export default ImageInput;
