interface MapTabProps {
  url: string;
  title: string;
  loading: boolean;
  showFinishedMessage?: boolean;
  finishedTimestamp?: string | null;
}

export const MapTab = ({
  url,
  title,
  loading,
  showFinishedMessage = false,
  finishedTimestamp = null,
}: MapTabProps) => {
  const formatFinishedTime = (timestamp: string | null) => {
    if (!timestamp) {
      return "";
    }

    const date = new Date(timestamp);

    return date.toLocaleTimeString("fi-FI", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col pb-4">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-gray-800 md:mx-auto md:w-2/3 md:max-w-4xl">
        <h2 className="p-2 font-semibold text-lg">
          {title}{" "}
          {loading && (
            <span className="text-gray-400 text-xs">(loading...)</span>
          )}
        </h2>

        <div className="mx-4 mb-4 flex-1 overflow-hidden rounded bg-gray-700">
          {loading ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              <p>Loading map...</p>
            </div>
          ) : showFinishedMessage ? (
            <div className="flex h-full flex-col items-center justify-start gap-6 p-6 text-center">
              <div className="rounded-full bg-gray-600 p-6">
                <svg
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white text-xl">
                  Event Finished
                </h3>
                <p className="text-gray-300 text-sm">
                  The run ended at {formatFinishedTime(finishedTimestamp)}.
                  <br />
                  The group may still be at the final brewery!
                </p>
              </div>
            </div>
          ) : (
            <iframe
              src={url}
              width="100%"
              height="100%"
              title={title}
              className="h-full w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
