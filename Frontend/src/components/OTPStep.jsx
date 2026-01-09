import { ErrorBox } from "./ErrorBox";
import OTPComp from "./OTPComp";

export const OTPStep = ({
    email,
    error,
    onVerify,
    onResend,
    onGoBack,
}) => {
     return(
    <div>
          <h1 className="font-semibold text-center text-2xl mb-5">
            Verification
          </h1>

            <p className="text-center mb-2 text-gray-600">
              Code sent to <b>{email}</b>
            </p>

            <p className="text-center text-sm mb-4">
              Wrong Email?{" "}
              <button
                onClick={onGoBack}
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                Go Back
              </button>
            </p>

          {error && <ErrorBox message={error} />}

          <div className="flex justify-center">
            <OTPComp 
              onVerify={onVerify} 
              onResend={onResend} 
            />
          </div>
        </div>
  )
}
   