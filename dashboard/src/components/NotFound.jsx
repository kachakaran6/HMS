import { useNavigate } from "react-router-dom";
import { TbError404 } from "react-icons/tb";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[100svh] flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* ICON */}
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <TbError404 className="text-4xl text-blue-600" />
        </div>

        {/* TEXT */}
        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        {/* ACTION */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </section>
  );
};

export default NotFound;
