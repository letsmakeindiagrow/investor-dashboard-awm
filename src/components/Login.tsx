import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to continue your investment journey</p>
      </div>

      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none bg-transparent',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              formButtonPrimary: 'bg-[#08AFF1] hover:bg-[#0899d1] text-white w-full',
              formFieldInput: 'mt-2',
              formFieldLabel: 'text-sm font-medium text-gray-700',
              socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
              dividerLine: 'bg-gray-200',
              dividerText: 'text-gray-500',
              formField: 'mb-4',
              formButtonReset: 'text-[#08AFF1] hover:text-[#0899d1]',
              footerActionText: 'text-gray-500',
              footerActionLink: 'text-[#08AFF1] hover:text-[#0899d1]',
            },
            layout: {
              logoPlacement: 'inside',
              socialButtonsPlacement: 'bottom',
            },
          }}
          routing="path"
          path="/login"
          afterSignInUrl="/dashboard"
          signUpUrl="/register"
        />
      </div>
    </div>
  );
};

export default Login;
