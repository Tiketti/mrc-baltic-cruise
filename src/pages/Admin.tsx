import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CLOUDFLARE_WORKER_URL } from "../constants";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const Admin = () => {
  useDocumentTitle("Admin - MRC Helsinki");

  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Updating LiveTrack URL...");

    try {
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": password,
        },
        body: JSON.stringify({ url, isLive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update URL");
      }

      toast.success("LiveTrack URL updated successfully!", { id: toastId });
      setUrl("");
      setPassword("");
      setIsLive(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update URL";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 text-white sm:px-8">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <Link
            to="/brewery-run#map"
            className="inline-flex items-center text-brand-blue hover:text-brand-blue/80"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Map
          </Link>
        </div>

        <h1 className="mb-4 text-center font-bold text-3xl">Admin Dashboard</h1>

        <div className="flex flex-col rounded-lg bg-gray-800 px-6 py-6 sm:px-10">
          <h2 className="mb-6 font-semibold text-xl">Update LiveTrack URL</h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="flex flex-col">
              <label htmlFor="url" className="mb-2 block font-medium text-sm">
                Garmin LiveTrack URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://livetrack.garmin.com/session/... (optional if just updating status)"
                className="min-w-0 rounded-lg bg-gray-700 px-4 py-3 text-white placeholder-gray-400 outline outline-1 outline-brand-blue transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-gray-700/30 p-4">
              <input
                type="checkbox"
                id="isLive"
                checked={isLive}
                onChange={(e) => setIsLive(e.target.checked)}
                className="mt-1 h-5 w-24 cursor-pointer rounded border-2 border-solid bg-gray-600 text-brand-blue transition-colors checked:border-brand-blue checked:bg-brand-blue focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-gray-800"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="isLive"
                  className="cursor-pointer font-medium text-sm"
                >
                  Event is currently active
                </label>
                <p className="mt-1 text-gray-400 text-xs">
                  Check this when people are actively running. Uncheck when
                  everyone has finished but might still be at the final venue.
                  The "Live" tab will hide automatically after 7 hours.
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-2 block font-medium text-sm"
              >
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                className="min-w-0 rounded-lg bg-gray-700 px-4 py-3 text-white placeholder-gray-400 outline outline-1 outline-brand-blue transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-blue px-6 py-3 font-semibold text-white transition-all hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ color: "white" }}
            >
              {isSubmitting ? "Updating..." : "Update LiveTrack URL"}
            </button>
          </form>

          <div className="mt-6 rounded bg-gray-700/50 p-4 text-sm">
            <p className="mb-2 font-semibold">Instructions:</p>
            <ol className="list-inside list-decimal space-y-1 text-gray-300">
              <li>
                <strong>Starting the event:</strong> Paste LiveTrack URL, check
                "Event is active", enter password, update
              </li>
              <li>
                <strong>Finishing the run:</strong> Leave URL empty, uncheck
                "Event is active", enter password, update
              </li>
              <li>
                <strong>Note:</strong> The Live tab will auto-hide 7 hours after
                your last update
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
