'use client'
import { useState, useEffect } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function DashboardSiswa() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('http://localhost:8000/api/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setUserData(result.data.user);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">
                Selamat datang, {userData?.name || 'Siswa'}!
            </h1>
        </div>
    );
}