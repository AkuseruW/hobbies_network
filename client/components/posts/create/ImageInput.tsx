import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageInputProps {
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const ImageInput: React.FC<ImageInputProps> = ({ handleImageChange }) => {
    return (
        <div className="items-center px-2 py-2">
            <label htmlFor="image-input" >
                <svg className="bg-blue-100 h-9 p-1.5 rounded-full text-blue-600 w-9 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
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
