import { SignIn } from "@clerk/nextjs";

interface SharedSignInProps {
  path?: string;
  signUpUrl?: string;
  fallbackRedirectUrl?: string;
  withSignUp?: boolean;
}

export function SharedSignIn({
  path,
  signUpUrl,
  fallbackRedirectUrl,
  withSignUp,
}: SharedSignInProps = {}) {
  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <SignIn
        path={path}
        routing={path ? "path" : undefined}
        signUpUrl={signUpUrl}
        fallbackRedirectUrl={fallbackRedirectUrl}
        withSignUp={withSignUp}
      />
    </div>
  );
}
