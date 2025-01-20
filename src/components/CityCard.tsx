interface CityCardProps {
  city: string;
  date: string;
  imageUrl: string;
  onClick: () => void;
}

const CityCard = ({ city, date, imageUrl, onClick }: CityCardProps) => {
  return (
    <div
      style={{ backgroundImage: `url("${imageUrl}")` }}
      className='bg-center bg-cover shadow-lg rounded-md hover:shadow-xl overflow-hidden flex flex-col items-center justify-between w-full h-80 p-4'
    >
      <h2 className='text-xl font-semibold bg-brand-paper px-4'>{city}</h2>
      <div className='p-4 text-center'>
        <p className='text-gray-500 bg-brand-paper'>{date}</p>
        <button
          type='button'
          onClick={onClick}
          className='mt-4 bg-brand-paper text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer'
        >
          View Agenda
        </button>
      </div>
    </div>
  );
};

export default CityCard;
