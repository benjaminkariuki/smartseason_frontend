// src/pages/ForgotPassword.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgotPassword = () => {
  const { email, setEmail, status, isLoading, handleSubmit } =
    useForgotPassword();

  return (
    <div className="bg-background text-on-surface h-screen flex flex-col font-body">
      {/* TopAppBar */}
      <header className="bg-[#f9faf4] font-medium tracking-tight w-full top-0 shadow-none z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-primary tracking-tighter">
            Smart Season
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

        {/* Card */}
        <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-xl ambient-shadow p-8 sm:p-10 border border-outline-variant/20">
          <div className="text-center mb-8">
            <h1 className="text-md-headline text-primary tracking-tight leading-tight mb-2">
              Reset Password
            </h1>
            <p className="text-md-body text-on-surface-variant font-medium">
              Enter your email to receive a reset link.
            </p>
          </div>

          {/* Status Messages */}
          {status.type === "error" && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded text-sm font-medium text-center">
              {status.message}
            </div>
          )}

          {status.type === "success" ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm font-medium border border-green-200">
                <span className="material-symbols-outlined block text-4xl text-green-600 mb-2">
                  mark_email_read
                </span>
                {status.message}
              </div>
              <Link
                to="/"
                className="inline-block w-full py-3 px-4 rounded-lg text-on-primary bg-primary hover:bg-primary-container transition-all font-bold shadow-sm"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  className="block text-sm font-bold text-on-surface mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-surface-container-highest border-none rounded-md text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-shadow"
                    id="email"
                    type="email"
                    placeholder="agronomist@farm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      Sending Link...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>

              <div className="text-center mt-6">
                <Link
                  to="/"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors underline-offset-2 hover:underline"
                >
                  Wait, I remember my password
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
