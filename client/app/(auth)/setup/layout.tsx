import Stepper from "@/components/auth/setupProfile/Stepper";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="container flex flex-col items-center justify-center h-screen">
            <div className="h-[30%] flex items-center justify-center"><Stepper /></div>
            <div className=" h-[70%] w-full flex flex-col justify-start">
                <div className="w-full flex justify-center">
                    {children}
                </div>
            </div>
        </main>
    );
}
