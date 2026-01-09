import { useState } from "react";
import { ErrorBox } from "./ErrorBox";

export const PasswordStep = ({
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    loading,
    error,
    onSubmit
}) => {
    const [showNPassword, setShowNPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)
    return (
    <div>
          <h1 className="font-semibold text-center mb-5 text-2xl">
            New Password
          </h1>
          
          {error && <ErrorBox message={error}/>}

          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="space-y-4"
          >
            <label
              htmlFor="newPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNPassword ? "text" : "password"}
                id="newPassword"
                placeholder="********"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
                className={`w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1 pr-10 ${
                  loading ? " bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {newPassword && (
                <button
                  type="button"
                  onClick={() => setShowNPassword(!showNPassword)}
                  className="absolute right-2 top-1.5 text-sm text-gray-600 hover:text-blue-500"
                >
                  {showNPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>

            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="********"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                className={`w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1 pr-10 ${
                  loading ? " bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowCPassword(!showCPassword)}
                  className="absolute right-2 top-1.5 text-sm text-gray-600 hover:text-blue-500"
                >
                  {showCPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 items-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 rounded-md"
            >
              {loading ? "Password Reseting..." : "Reset Password"}
            </button>
          </form>
        </div>
  )
}
    