import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
