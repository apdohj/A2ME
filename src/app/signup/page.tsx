import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = { title: "Create Account — A2ME" };

export default function SignupPage() {
  return <SignupForm />;
}
