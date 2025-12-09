import { LoginForm } from "@/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">مرحباً بعودتك 👋</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;