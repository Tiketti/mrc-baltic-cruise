interface CityCardProps {
  city: string;
  date: string;
  imageUrlSmall: string;
  imageUrl: string;
  onClick: () => void;
}

export const CityCard = ({
  city,
  date,
  imageUrlSmall,
  imageUrl,
  onClick,
}: CityCardProps) => {
  return (
    <div
      style={{
        backgroundImage: `image-set("${imageUrlSmall}" 1x, "${imageUrl}" 2x)`,
      }}
      className="flex h-80 w-full flex-col items-center justify-between overflow-hidden rounded-md bg-center bg-cover p-4 shadow-lg hover:shadow-xl"
    >
      <h3 className="max-w-fit bg-brand-paper px-16">{city}</h3>
      <div className="p-4 text-center">
        <p className="bg-brand-paper text-gray-500">{date}</p>
        <button
          type="button"
          onClick={onClick}
          className="mt-8 cursor-pointer rounded bg-brand-paper px-4 py-2 text-white hover:bg-blue-600"
        >
          View Agenda
        </button>
      </div>
    </div>
  );
};
