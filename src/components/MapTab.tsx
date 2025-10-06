export const MapTab = () => {
  return (
    <div className="space-y-4">
      {/* Map Section */}
      <div className="rounded-lg bg-gray-800 px-4">
        <h2 className="mb-4 font-semibold text-lg">Route Map</h2>

        <div className="overflow-hidden rounded bg-gray-700">
          <iframe
            src="https://www.komoot.com/tour/2505302520/embed?share_token=aMsEPjpxi5BneySQiuFEE14Iw3TOcdAvHAwJjgnBRSuNNZo1s2"
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Brewery Run Route"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
