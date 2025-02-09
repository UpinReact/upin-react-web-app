"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "./actions";
import Link from "next/link";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";

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
    // Handle interests array
    value.forEach((interest: string) => submissionData.append("interests", interest));
  } else {
    // Handle all other fields
    submissionData.append(key, String(value)); // Ensure value is always a string
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

  return (
    (<div className="relative flex items-center justify-center w-screen h-screen bg-upinGreen -z-0">
      <Image 
        src={bgImg} 
        alt="Background" 
        layout="fill" 
        className="absolute opacity-10 object-cover -z-10" 
      />
      <div className="relative p-8 bg-upinGreen bg-opacity-20 border border-green-200 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-3xl z-10">
        <h1 className="mb-6 text-6xl text-center font-montserrat">Sign Up</h1>
        <form onSubmit={handleSubmit} className="grid w-full gap-6 grid-cols-2">
          {["email", "password", "confirmPassword", "firstName", "lastName", "phone", "birthdate"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="text-2xl capitalize">
                {field === "confirmPassword" ? "Confirm Password" : field.replace(/([A-Z])/g, " $1")}:
              </label>
              <input
                type={
                  field.includes("password") ? "password" : 
                  field === "birthdate" ? "date" : 
                  field === "phone" ? "tel" : "text"
                }
                id={field}
                name={field}
                className="w-full p-2 border border-gray-300 rounded-2xl"
                value={formData[field as keyof typeof formData] || ""}
                onChange={handleChange}
                required
              />
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
    </div>)
  );
}