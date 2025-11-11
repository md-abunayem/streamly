const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-3 text-blue-600 font-semibold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
