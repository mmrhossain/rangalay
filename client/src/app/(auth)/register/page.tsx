import React from 'react';
// import MasterLayout from "@/components/layout/MasterLayout";
import Features from '@/components/shared/Features';
import RegistrationForm from '@/components/forms/RegistrationForm';

const page = () => {
    return (
        <>
            <RegistrationForm />
            <Features />
        </>
    );
};

export default page;