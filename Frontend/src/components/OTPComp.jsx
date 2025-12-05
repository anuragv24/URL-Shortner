import { useEffect, useRef, useState } from "react";

const OTPBoxSize = 6;

const OTPComp = ({onVerify}) => {
  const [inputArr, setInputArr] = useState(Array(OTPBoxSize).fill(""));
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true)

  const refArr = useRef([]);

  useEffect(() => {
    refArr.current[0]?.focus();
  }, []);

  useEffect(() => {
    let interval
    if(isResendDisabled && timer > 0){
        interval = setInterval(() => {
            setTimer((prev) => prev - 1)
        }, 1000)
    } else if (timer === 0){
        setIsResendDisabled(false)
    } 
    return () => clearInterval(interval)
  }, [isResendDisabled, timer])

  const handleResend = () => {
    setIsResendDisabled(true)
    setTimer(30)
    //call backend resend API 
  }

  const handleInput = (e, index) => {
    let value = e.target.value
    value = value.trim()
    if (isNaN(value)) return;

      const copyInput = [...inputArr];
      copyInput[index] = value.slice(-1);
      setInputArr(copyInput);

      if (value && index < OTPBoxSize - 1) {
        refArr.current[index + 1]?.focus();
      }
  };

  const handlePaste = (e) => {
    e.preventDefault()
    const data = e.clipboardData.getData("text");
    const pastedData = data.replace(/\D/g, '').slice(0, OTPBoxSize);
    if (!pastedData) return;
    const copyInput = [...inputArr];
    pastedData.split("").forEach((char, index) => {
        copyInput[index] = char;
    });

    setInputArr(copyInput)

    const lastFilledIndex = pastedData.length - 1;
    const nextFocusIndex = Math.min(lastFilledIndex + 1, OTPBoxSize - 1);
    if (pastedData.length === OTPBoxSize) {
         refArr.current[OTPBoxSize - 1]?.focus(); 
    } else {
         refArr.current[nextFocusIndex]?.focus();
    }

  }

  const handleOnKeyDown = (e, index) => {

    if(e.key === "Backspace"){
      if (inputArr[index] !== "") {
        const copyInput = [...inputArr];
        copyInput[index] = "";
        setInputArr(copyInput);
      } else {
        refArr.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0){
        refArr.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < OTPBoxSize - 1){
        refArr.current[index + 1]?.focus()
    }
  };

  

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <p>Enter OTP sent to email, to verify..</p>

      <div className="flex gap-2" onPaste={handlePaste}>
        {inputArr.map((input, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={input}
            onChange={(e) => handleInput(e, index)}
            ref={(input) => (refArr.current[index] = input)}
            onKeyDown={(e) => handleOnKeyDown(e, index)}
            className="h-10 w-10 text-xl text-center border border-gray-500 rounded focus:border-blue-500 focus:outline-none"
          />
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <p className="text-gray-500">Didn't receive code ?</p>
        <button 
            onClick={handleResend}
            disabled={isResendDisabled}
            className={`font-semibold ${isResendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 cursor-pointer'}`}
            >
                {isResendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
      </button>
      </div>

      <button 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
        onClick={() => onVerify(inputArr.join(""))}
        disabled={inputArr.some(i => i === "")}
      >
        Verify
      </button>

      
    </div>
  );
};

export default OTPComp;
