// src/pages/Login.jsx
import React from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
  // Bring in the logic from our hook
  const {
    credentials,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
  } = useLogin();

  return (
    <div className="bg-background text-on-surface h-screen flex flex-col font-body">
      {/* TopAppBar */}
      <header className="bg-[#f9faf4] font-medium tracking-tight w-full top-0 shadow-none z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-primary tracking-tighter">
            Smart Season
          </div>
          <div className="flex items-center gap-4">
            <button className="text-primary hover:bg-[#f3f4ee] p-2 rounded-full transition-colors active:scale-95 flex items-center justify-center"></button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Texture */}
        <div
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface/80 to-surface"></div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-xl ambient-shadow p-8 sm:p-10 border border-outline-variant/20">
          <div className="text-center mb-8">
            <h1 className="text-md-headline text-primary tracking-tight leading-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-md-body text-on-surface-variant font-medium">
              Access your crop data and insights.
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-md-label text-on-surface mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  {/* Mail SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-surface-container-highest border-none rounded-md text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-shadow"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="agronomist@farm.com"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-md-label text-on-surface mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  {/* Lock SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  className="block w-full pl-10 pr-12 py-3 bg-surface-container-highest border-none rounded-md text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-shadow"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    // Eye closed SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.94 17.94A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.73 0 3.36.44 4.76 1.21M1 1l22 22"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.53 9.53A3.5 3.5 0 0012 15.5c1.93 0 3.5-1.57 3.5-3.5 0-.47-.09-.92-.26-1.33"
                      />
                    </svg>
                  ) : (
                    // Eye open SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-on-primary font-bold shadow-sm transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary-container"}`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-on-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f3f4ee] text-sm w-full z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-4 w-full gap-4 max-w-7xl mx-auto">
          <div className="text-lg font-bold text-secondary">
            Smart Season Platform
          </div>
          <div className="text-primary text-center md:text-left">
            © 2026 Smart Season. Secure Agricultural Systems.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
