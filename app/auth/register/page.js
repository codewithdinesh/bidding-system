"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('bidder');
    const router = useRouter();


    useEffect(() => {
        if (localStorage.getItem('userId')) {
            router.push('/');
        }
    }, []);

    const handleRegister = async () => {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });
        const user = await response.json();

        if (user._id) {
            localStorage.setItem('userId', user._id);
            localStorage.setItem("role", user.role);

            // alert('You have been registered successfully.');


            alert('You have been registered successfully.');
            router.push('/');
            window.location.reload();
        } else {
            alert('Something went wrong or user already exists');
        }
    };

    return (
        <div className="container-sm max-w-2xl mx-auto p-4 flex flex-col border border-gray-300 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="border border-gray-300 p-2 rounded-md w-full  mb-2"
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border border-gray-300 p-2 rounded-md w-full  mb-2"
            />



            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full  mb-4"
            >
                <option value="creator">Creator</option>
                <option value="bidder">Bidder</option>
            </select>
            <button
                onClick={handleRegister}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Register
            </button>


            {/* If already have a account */}
            <div className="mt-4">
                <span>Already have an account?</span>
                <Link href="/auth/login" className="text-blue-500 hover:underline cursor-pointer">Login</Link>
            </div>
        </div>
    );
}
