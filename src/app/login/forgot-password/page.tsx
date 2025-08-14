"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "utils/supabase/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
     
      const { error } = await supabase.auth.resetPasswordForEmail(email); // Removed redirectTo
  
      if (error) throw error;
  
      setMessage("A reset token has been sent to your email.");
      setToken(true); // Show the reset password form
    } catch (error) {
      setMessage("Failed to send reset token. Please try again.");
      console.error("Error sending reset token:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }
  
    try {
      
      
      // Sign in using the reset token to authenticate the user session
      const { error: signInError } = await supabase.auth.verifyOtp({
        email,
        token: resetToken,
        type: "recovery"
      });
  
      if (signInError) throw signInError;
  
      // Now the user is authenticated, we can update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (updateError) throw updateError;
  
      setMessage("Password reset successfully.");
      setTimeout(() => {
        router.push("/login"); // Redirect to login page after successful reset
      }, 2000);
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        {!token ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Enter reset code"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {message && <p className="mt-4 text-center text-sm">{message}</p>}

        <button
          onClick={() => router.push("/login")}
          className="mt-4 w-full text-center text-blue-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}