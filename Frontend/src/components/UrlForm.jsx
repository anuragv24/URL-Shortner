import React, { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import { queryClient } from "../main";
import QRCode from "react-qr-code";

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [customSlug, setCustomSlug] = useState("");
  const [isGenerateQR, setIsGenerateQR] = useState(false)

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const shortUrl = await createShortUrl(url, customSlug);
      console.log("shortUrl, ", shortUrl);
      // console.log(shortUrl);
      setShortUrl(shortUrl);
      queryClient.invalidateQueries({ queryClient: ["userurls"] });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const generateQR = () => {
    setIsGenerateQR(prev => !prev)
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="url" className="block font-medium text-gray-700 mb-1">
          Enter your Url
        </label>
        <input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          required
          onChange={(e) => setUrl(e.target.value)}
          className="w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 items-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 rounded-md"
        >
          Shorten URL
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>

      {isAuthenticated && !shortUrl && (
        <div className="mt-4">
          <label
            htmlFor="customSlug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Custom URL (optional)
          </label>
          <input
            type="text"
            id="customSlug"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="Enter custom slug"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {shortUrl && (
        <div className="mt-8 flex flex-col space-y-5">
          <h2 className="text-xl font-medium mb-3">Your Shortened URL:</h2>
          <div className="flex">
            <input
              type="url"
              readOnly
              value={shortUrl}
              className="w-full border border-gray-300 bg-gray-50 rounded-l-md px-2 py-1 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={` rounded-r-md px-4  font-medium transition-colors duration-300 ${
                copied
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
            {isAuthenticated && <button onClick={generateQR}>Generate QR</button>}
          </div>
          {isGenerateQR && <QRCode 
        size={256}
        value={shortUrl} />}
        </div>
      )}
      
    </>
  );
};

export default UrlForm;
