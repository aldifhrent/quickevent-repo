import SignUpForm from "@/app/(pages)/(auth)/_components/signup.form";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign Up - QuickEvent",
  description: "Create an account to get started.",
};

export default function SignInPage() {
  return (
    <div>
      <Card className="w-full max-w-md space-y-6 p-8">
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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up to join us and explore more.
          </p>
        </div>

        <SignUpForm />
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
