// app/register/page.tsx
"use client";
import { User, Mail, Lock, GraduationCap, Building2, BookOpen, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        password_confirmation: '',
        nis: '',
        kelas: '',
        jurusan: '',
        alamat: '',
        telepon: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('http://localhost:8000/api/register/siswa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                alert('Registrasi berhasil! Silakan login.');
                router.push('/');
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    setErrors({ general: result.message || 'Registrasi gagal' });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ general: 'Terjadi kesalahan saat registrasi' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{errors.general}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.nama ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.email ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.password ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.password_confirmation ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                        </div>

                        {/* NIS */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">NIS</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="nis"
                                    value={formData.nis}
                                    onChange={handleChange}
                                    placeholder="Enter your NIS"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.nis ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
                        </div>

                        {/* Kelas */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Kelas</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="kelas"
                                    value={formData.kelas}
                                    onChange={handleChange}
                                    placeholder="Enter your class (e.g. XII RPL 1)"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.kelas ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.kelas && <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>}
                        </div>

                        {/* Jurusan */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Jurusan</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="jurusan"
                                    value={formData.jurusan}
                                    onChange={handleChange}
                                    placeholder="Enter your major"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.jurusan ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.jurusan && <p className="text-red-500 text-xs mt-1">{errors.jurusan}</p>}
                        </div>

                        {/* Alamat */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Alamat</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Telepon */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Telepon</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="telepon"
                                    value={formData.telepon}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Already have an account?{" "}
                            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}