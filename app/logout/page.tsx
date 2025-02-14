"use client";

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        signOut({
            redirect: false,
            callbackUrl: '/'
        }).then(() => {
            router.push('/');
        });
    }, []);
}