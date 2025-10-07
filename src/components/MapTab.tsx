export const MapTab = () => {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col pb-4">
      {/* Map Section */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-gray-800">
        <h2 className="px-4 pt-4 pb-2 font-semibold text-lg">Route Map</h2>

        <div className="mx-4 mb-4 flex-1 overflow-hidden rounded bg-gray-700">
          <iframe
            src="https://connect.garmin.com/modern/course/embed/409837108"
            width="100%"
            height="100%"
            title="Course Embed"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};
