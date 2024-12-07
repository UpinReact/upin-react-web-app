"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "./actions";
import Link from "next/link";
import Image from "next/image";
import signUpPic from "../../../public/pic.jpg";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import arrowDown from "../../../public/arrowDown.json";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInterests(prev =>
      event.target.checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate passwords
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
  
    // Create a FormData object
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("birthdate", birthdate);
    formData.append("bio", bio);
    formData.append("interests", JSON.stringify(interests));
  
    try {
      const result = await signup(formData);
  
      if (result.success) {
        router.push("/account");
      } else {
        setErrorMessage(result.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("Unexpected error occurred");
      console.error(error);
    }
  };
  

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={signUpPic}
        alt="Background picture"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="absolute inset-0 z-[-1]"
      />

      {/* Lottie Animations */}
      <Lottie
        animationData={arrowDown}
        style={{ width: 300, height: 500 }}
        className="absolute top-1/4 left-10 transform -translate-y-1/2"
      />
      <Lottie
        animationData={arrowDown}
        style={{ width: 300, height: 500 }}
        className="absolute top-1/4 right-10 transform -translate-y-1/2"
      />

      {/* Sign Up Form Container */}
      <div className="relative w-auto h-auto my-20 bg-upinGreen rounded-3xl p-7 shadow-2xl shadow-slate-400 backdrop-filter backdrop-blur-3xl border border-green-200 bg-opacity-20">
        <h1 className="font-montserrat text-center mb-5 text-6xl">Sign Up</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 w-full">
          <label htmlFor="email" className="text-2xl">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-2xl p-2 border border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="text-2xl">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-2xl p-2 border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword" className="text-2xl">
            Confirm Password:
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            className="rounded-2xl p-2 border border-gray-300"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label htmlFor="firstName" className="text-2xl">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            className="rounded-2xl p-2 border border-gray-300"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName" className="text-2xl">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            className="rounded-2xl p-2 border border-gray-300"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="phone" className="text-2xl">
            Phone Number:
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="rounded-2xl p-2 border border-gray-300"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <legend className="text-2xl col-span-2">Choose your Interests:</legend>
          <div className="grid grid-cols-2 gap-2 col-span-2">
            {["Music", "Movies", "Gaming", "Chilling", "Literature", "Other"].map((interest) => (
              <div key={interest}>
                <input
                  type="checkbox"
                  id={interest}
                  name="interests"
                  value={interest}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={interest} className="px-2">{interest}</label>
              </div>
            ))}
          </div>

          <label htmlFor="gender" className="text-2xl col-span-2">
            Select Gender:
          </label>
          <select
            id="gender"
            name="gender"
            className="rounded-2xl p-2 border border-gray-300 col-span-2"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer not to say">Prefer not to say</option>
          </select>

          <label htmlFor="birthdate" className="text-2xl">
            Birthdate:
          </label>
          <input
            type="date"
            name="birthdate"
            id="birthdate"
            className="rounded-2xl p-2 border border-gray-300"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />

          <div className="flex col-span-2">
            <label htmlFor="bio" className="text-2xl col-span-2 mr-20">
              Add a bio:
            </label>
            <textarea
              name="bio"
              id="bio"
              cols={60}
              rows={2}
              placeholder="Just something small..."
              className="rounded-2xl p-2 border border-gray-300"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 font-extrabold border bg-white text-center col-span-2">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="bg-black text-white w-full py-2 rounded-2xl col-span-2 hover:bg-slate-900 backdrop-filter backdrop-blur-xl border border-green-400 bg-opacity-50"
          >
            Sign up
          </button>
        </form>
        <motion.button
          whileHover={{ scale: 1.2 }}
          className="rounded-2xl m-2 hover:text-black"
        >
          <Link
            href={"/login"}
            className="block text-center mt-4 p-5 underline"
          >
            Already have an account? Login
          </Link>
        </motion.button>
      </div>
    </div>
  );
}

