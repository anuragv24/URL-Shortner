import React from 'react'

const Expired = () => {
  return (
    <div style={{ 
      display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#f5f5f5" 
    }}> 
        <div className="" style={{ background:"white", padding:"30px", borderRadius:"10px", textAlign:"center" }} >
            <h2>Link not found...</h2>
            <p>This short link is no longer available.</p>
            <a href="/" style={{color: '#007bff'}}>Go to home</a>
        </div>
    </div>
  )
}

export default Expired