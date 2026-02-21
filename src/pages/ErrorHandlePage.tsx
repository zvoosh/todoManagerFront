import { Link } from "react-router";

const ErrorHandlePage = () => {
  return (
    <div className="w-full h-full bg-gray-200">
      <div className="w-full h-14 bg-gray-700">
        <div className="flex gap-2 items-center w-1/7 h-full border-r-2 border-b-2 border-gray-800/20">
          <h2 className="text-2xl font-bold w-full text-center text-white">
            To-do list Manager
          </h2>
        </div>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <img src="/creature.png" className="w-1/9" />
        <p className="text-2xl text-center">
          You got a 404 Error. <br /> Page not Found.
          <br />
          Please navigate to the main page or log in.
        </p>
        <div className="flex flex-col gap-1 text-center mt-3 text-xl">
            <Link to={'/login'} className="border px-2 py-1 bg-blue-600 text-white">Log in</Link>
            <Link to={'/tasks'} className="px-2 py-1 underline underline-offset-3">Main page</Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandlePage;
