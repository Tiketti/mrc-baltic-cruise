interface MapTabProps {
  url: string;
  title: string;
  loading: boolean;
}

export const MapTab = ({ url, title, loading }: MapTabProps) => {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col pb-4">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-gray-800 md:mx-auto md:w-2/3 md:max-w-4xl">
        <h2 className="px-4 pt-4 pb-2 font-semibold text-lg">
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
