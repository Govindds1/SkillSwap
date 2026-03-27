import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center px-4 py-12">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}
