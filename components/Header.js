"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId);
    }, []);

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            localStorage.removeItem('userId');
            setIsLoggedIn(false);
            alert('You have been logged out.');
            router.push('/'); // Redirect to login page or home
        } else {
            router.push('/auth/register'); // Redirect to registration page
        }
    };

    return (
        <header className="bg-gray-200 rounded-full  p-4 flex items-center justify-between mb-4 shadow-2xl">
            <div className="flex items-center">
                {/* <Image
                    src="/logo.svg" 
                    alt="Logo"
                    width={40}
                    height={40}
                    className="mr-2"
                /> */}
                <span className="text-xl font-bold cursor-pointer ">
                    <Link href="/">Bidding System</Link>
                </span>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={handleLoginLogout}
                    className="py-2 px-4  hover:bg-blue-100 rounded-full"
                >

                    <span className="text-lg font-semibold flex">
                        <FaUserCircle size={30} className='mr-2' />
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </span>
                </button>

            </div>
        </header>
    );
}
