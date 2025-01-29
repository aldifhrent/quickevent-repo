import SignInForm from "@/components/signin.form";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div>
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/logo.svg" // Ganti dengan logo Anda
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up to join us and explore more.
          </p>
        </div>

        {/* FORM */}
        <div>
          <SignInForm />
        </div>

        {/* Footer: Links */}
        <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
