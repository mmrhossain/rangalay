import { ReactNode } from "react";
import Sidebar from "@/components/customer/Sidebar";
import ProtectedRoute from "@/components/protect/ProtectedRoute";
import Banner from "@/components/customer/Banner";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            {/* Soft background makes the white dashboard cards stand out */}
            <div className="bg-[#F8FAFC] w-full min-h-screen pb-24 md:pb-20">
                
                {/* Banner Section */}
                <div className="w-full bg-white">
                    <Banner />
                </div>

                <div className="container mt-6 md:mt-12">
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:items-start">

                        {/* Sidebar - Sticky on Desktop */}
                        <aside className="w-full lg:w-72 lg:sticky lg:top-24">
                            <Sidebar />
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[420px] md:min-h-[600px] transition-all duration-300 overflow-hidden">
                            {/* Inner Padding for content */}
                            <div className="p-4 sm:p-5 md:p-8 lg:p-10">
                                {children}
                            </div>
                        </main>

                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
