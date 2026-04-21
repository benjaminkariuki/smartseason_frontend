// src/pages/ResetPassword.jsx
import React from 'react';
import { useResetPassword } from '../hooks/useResetPassword';

const ResetPassword = () => {
    const { passwords, status, isLoading, handleChange, handleSubmit } = useResetPassword();

    return (
        <div className="bg-background text-on-surface h-screen flex flex-col font-body">
            <header className="bg-[#f9faf4] font-medium tracking-tight w-full top-0 shadow-none z-50">
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-primary tracking-tighter">
                        Smart Season
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')" }}
                ></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface/80 to-surface"></div>

                <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-xl ambient-shadow p-8 sm:p-10 border border-outline-variant/20">
                    <div className="text-center mb-8">
                        <h1 className="text-[2rem] font-headline font-bold text-primary tracking-tight leading-tight mb-2">
                            Create New Password
                        </h1>
                        <p className="text-on-surface-variant text-sm font-medium">
                            Please secure your account with a new password.
                        </p>
                    </div>

                    {status.type === 'error' && (
                        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded text-sm font-medium text-center">
                            {status.message}
                        </div>
                    )}

                    {status.type === 'success' ? (
                        <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm font-medium border border-green-200 text-center">
                            <span className="material-symbols-outlined block text-4xl text-green-600 mb-2">check_circle</span>
                            {status.message}
                            <p className="mt-2 text-xs text-green-700">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-2" htmlFor="password">
                                    New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                                        <span className="material-symbols-outlined text-[20px]">lock</span>
                                    </span>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 bg-surface-container-highest border-none rounded-md text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-shadow"
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Min 8 characters"
                                        value={passwords.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-2" htmlFor="password_confirmation">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                                    </span>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 bg-surface-container-highest border-none rounded-md text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-shadow"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        placeholder="Repeat new password"
                                        value={passwords.password_confirmation}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-on-primary font-bold shadow-sm transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary-container"}`}
                                >
                                    {isLoading ? 'Resetting Password...' : 'Save New Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;