import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0e0e0e] px-4">
      <Link
        href="/"
        className="mb-8 text-sm font-semibold tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
      >
        ✦ Synapse
      </Link>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
