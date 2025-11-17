import UrlForm from "../components/UrlForm";

const DashboardPage = () => {
  console.log("inside dashboard page.....")
  return (
    <div className="h-full bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white  p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-center mb-4">
          Shorten your links
        </h2>
        <UrlForm />
      </div>
    </div>
  );
};

export default DashboardPage;
