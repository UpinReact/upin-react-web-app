"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { logout } from "../login/actions";

export default function SessionButtons({ session }: { session: any }) {
  const router = useRouter();

  if (session) {
    return (
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-white bg-upinBlue hover:bg-blue-600 px-4 py-2 rounded-full shadow-md"
        >
          <Link href="/private">Go to account</Link>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-white bg-upinBlue hover:bg-blue-600 px-4 py-2 rounded-full shadow-md"
        >
          <Link href="/private/check-pins">Go to my Pins</Link>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full shadow-md"
          onClick={async () => {
            await logout();
            router.refresh();
          }}
        >
          Sign Out
        </motion.button>
      </div>
    );
  }

  return (
    <ul className="flex space-x-4">
      <li className="hover:text-yellow-300">
        <Link href="/login">Log In</Link>
      </li>
      <li className="hover:text-yellow-300">
        <Link href="/sign-up">Sign Up</Link>
      </li>
    </ul>
  );
}
