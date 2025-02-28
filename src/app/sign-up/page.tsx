"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "./actions";
import Link from "next/link";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import supabase from "utils/supabase/supabase";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    birthdate: "",
    bio: "",
    interests: [] as string[],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const router = useRouter();
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      interests: e.target.checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, confirmPassword, ...rest } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "interests" && Array.isArray(value)) {
        value.forEach((interest: string) => submissionData.append("interests", interest));
      } else {
        submissionData.append(key, String(value));
      }
    });

    try {
      const result = await signup(submissionData);
      if (result.success) {
        
        router.push("/private");
      } else {
        setErrorMessage(result.message || "An error occurred");
      }
    } catch {
      setErrorMessage("Unexpected error occurred");
    }
  };

  const clearInput = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  return (
    <div className="relative flex items-center justify-center w-screen bg-upinGreen -z-0">
      <Image 
        src={bgImg} 
        alt="Background" 
        layout="fill" 
        className="absolute opacity-10 object-cover -z-10" 
      />
      <div className="relative p-8 bg-upinGreen bg-opacity-20 border border-green-200 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-3xl z-10">
        <h1 className="mb-6 text-6xl text-center font-montserrat">Sign Up</h1>
        <form onSubmit={handleSubmit} className="grid w-auto gap-6 grid-cols-2">
          {["email", "password", "confirmPassword", "firstName", "lastName", "phone", "birthdate"].map((field) => (
            <div key={field} className="relative">
              <label htmlFor={field} className="text-2xl capitalize">
                {field === "confirmPassword" ? "Confirm Password" : field.replace(/([A-Z])/g, " $1")}:
              </label>
              <div className="relative">
                <input
                  type={
                    field === "password" || field === "confirmPassword"
                      ? field === "password"
                        ? showPassword ? "text" : "password"
                        : showConfirmPassword ? "text" : "password"
                      : field === "birthdate" ? "date" 
                      : field === "phone" ? "tel" 
                      : "text"
                  }
                  id={field}
                  name={field}
                  className="w-full p-2 border border-gray-300 rounded-2xl pr-10"
                  value={formData[field as keyof typeof formData] || ""}
                  onChange={handleChange}
                  required
                />
                {(field === "password" || field === "confirmPassword") && (
                  <button
                    type="button"
                    onClick={() => {
                      if (field === "password") setShowPassword(!showPassword);
                      if (field === "confirmPassword") setShowConfirmPassword(!showConfirmPassword);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {field === "password" ? (
                      showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )
                    ) : showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                )}
                {formData[field as keyof typeof formData] && field !== "password" && field !== "confirmPassword" && (
                  <button
                    type="button"
                    onClick={() => clearInput(field)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <fieldset className="col-span-2">
            <legend className="mb-2 text-2xl">Choose your Interests:</legend>
            <div className="grid grid-cols-2 gap-2">
              {["Music", "Movies", "Gaming", "Chilling", "Literature", "Other"].map((interest) => (
                <label key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleCheckboxChange}
                  />
                  <span className="ml-2">{interest}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="col-span-2">
            <label htmlFor="gender" className="text-2xl">
              Select Gender:
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full p-2 border border-gray-300 rounded-2xl"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex flex-col col-span-2">
            <label htmlFor="bio" className="mb-2 text-2xl">
              Add a bio:
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              className="p-2 border border-gray-300 rounded-2xl"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Just something small..."
            />
          </div>

          {errorMessage && <p className="col-span-2 p-2 text-center text-red-500 bg-white rounded-xl">{errorMessage}</p>}

          <button
            type="submit"
            className="col-span-2 py-2 font-bold text-white bg-black rounded-2xl hover:bg-slate-900 backdrop-blur-xl"
          >
            Sign up
          </button>
        </form>
        <motion.div whileHover={{ scale: 1.1 }} className="mt-4">
          <Link href="/login" className="block text-center underline">
            Already have an account? Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}


