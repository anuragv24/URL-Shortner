import { ErrorBox } from "./ErrorBox";

export const EmailStep = ({
  email,
  setEmail,
  loading,
  error,
  handleSubmit,
}) => {
  const isEmailValid = email.trim() !== "";
  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleSubmit()
  }
  return (
    <div>
      <h2 className="font-semibold text-center mb-5 text-2xl">
        Forgot Password
      </h2>

      {error && <ErrorBox message={error} />}

      <p className="text-center mb-5 text-gray-600">
        Don't worry it happens. Please enter the email associated with your
        accound.
      </p>

      <form autoComplete="off" onSubmit={handleFormSubmit} className="space-y-4">
        <label htmlFor="email" className="block font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email address"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          className="w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-3 py-2"
        />

        <button
          type="submit"
          disabled={!isEmailValid || loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 items-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 rounded-md"
        >
          {loading ? "Sending Code... " : "Send Code"}
        </button>
      </form>
    </div>
  );
};
