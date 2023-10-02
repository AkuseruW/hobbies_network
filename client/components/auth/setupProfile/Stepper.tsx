import { cookies } from "next/headers";
import Link from "next/link";

interface Step {
    name: string;
    link: string;
    isValid: boolean;
}

const CheckoutSteps = () => {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('setup_info')?.value;
    const hobbiesCookie = cookieStore.get('hobbies_info')?.value;

    const steps: Step[] = [
        { name: 'Information', link: '/setup', isValid: true },
        { name: 'Hobbies', link: '/setup/hobbies', isValid: userCookie ? true : false },
        { name: 'Confirmation', link: '/setup/confirmation', isValid: hobbiesCookie && userCookie ? true : false },
    ];

    return (
        <div className="flex justify-center items-center my-6 sm:space-x-4 max-sm:flex-col max-sm:gap-y-3">
            {steps.map((step, index) => (
                <div key={step.name} className={`flex items-center max-sm:flex-col gap-y-2 ${index == 1 && "max-sm:gap-y-3"}`}>
                    {index !== 0 && (
                        <div className={`h-0.5 w-12 ${step.isValid ? "bg-black" : "bg-gray-200"} dark:bg-gray-700 max-sm:h-6 max-sm:w-0.5`} />
                    )}
                    <Link
                        href={step.isValid ? step.link : '/'}
                        className={`ml-2 text-lg ${step.isValid ? "text-black font-semibold" : "text-gray-400 font-normal"} dark:text-white max-sm:m-0`}
                    >
                        {step.name}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default CheckoutSteps;
