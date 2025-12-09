import React from 'react'
import UrlForm from '../components/UrlForm'

const Homepage = () => {
  console.log("Inside HomePage......")
  return (
   <div className="flex h-full flex-col items-center justify-center bg-gray-100" >
     <div className="w-full max-w-4xl  bg-white shadow-md rounded-lg p-8" >
        <h1 className='font-semibold text-center mb-5 text-2xl'>URL Shortener</h1>
        <UrlForm/>
    </div>
    <p className='text-xl mt-1'><span className=' font-bold'>Note: </span>Links created without an account will be deleted after 60 minutes.</p>

   </div>
  )
}

export default Homepage
