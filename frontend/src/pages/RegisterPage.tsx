import RegistrationForm from '../components/RegistrationForm';

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-xl rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join the conversation and start chatting with others.
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegisterPage;