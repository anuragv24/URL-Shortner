import { useEffect } from "react";

export default function Modal({isOpen, onClose, children}){
    useEffect(() => {
        const handleEsc = (e) => {
            if(e.key === "Escape") onClose();
        }
        if(isOpen) document.addEventListener("keydown", handleEsc)
        return () => document.removeEventListener("keydown", handleEsc)
    }, [isOpen, onClose])
    if (!isOpen) return null;

    return(
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 " onClick={onClose}>
            <div className="flex items-center justify-center p-10 bg-white rounded-lg w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg font-bold cursor-pointer hover:bg-red-200 transition" 
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    )

}