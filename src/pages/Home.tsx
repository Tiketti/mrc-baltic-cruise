import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const Home = () => {
  useDocumentTitle("Welcome | MRC");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <h1 className="mb-4 font-bold text-4xl text-gray-900 md:text-6xl">
          Welcome to the New Site
        </h1>
        
        <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
          This is a placeholder for the new root site. The original Baltic Cruise site 
          has been preserved and is still accessible.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/baltic-cruise"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            View Baltic Cruise Site
          </Link>
          
          <p className="text-gray-500 text-sm">
            The original site is now available at <code className="rounded bg-gray-200 px-2 py-1">/baltic-cruise</code>
          </p>
        </div>

        <div className="mt-12 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-2xl text-gray-800">
            Ready for Development
          </h2>
          <p className="text-gray-600">
            This new root site is ready for you to build whatever comes next. 
            All the original components, styles, and assets are preserved and can be reused.
          </p>
        </div>
      </div>
    </div>
  );
};
