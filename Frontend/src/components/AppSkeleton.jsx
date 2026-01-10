const AppSkeleton = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* Navbar Skeleton */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />

            {/* Right side buttons */}
            <div className="flex items-center space-x-6">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          
          {/* Heading */}
          <div className="h-7 w-48 mx-auto mb-6 bg-gray-200 rounded animate-pulse" />

          {/* URL input */}
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse mb-4" />

          {/* Button */}
          <div className="h-12 w-40 mx-auto bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Note text */}
        <div className="mt-4 h-5 w-[520px] bg-gray-200 rounded animate-pulse" />
      </main>
    </div>
  )
}

export default AppSkeleton
