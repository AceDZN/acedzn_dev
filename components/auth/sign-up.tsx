import { SignUp } from "@clerk/nextjs";

interface SharedSignUpProps {
  path?: string;
  signInUrl?: string;
  fallbackRedirectUrl?: string;
}

export function SharedSignUp({
  path,
  signInUrl,
  fallbackRedirectUrl,
}: SharedSignUpProps = {}) {
  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <SignUp
        path={path}
        routing={path ? "path" : undefined}
        signInUrl={signInUrl}
        fallbackRedirectUrl={fallbackRedirectUrl}
      />
    </div>
  );
}
