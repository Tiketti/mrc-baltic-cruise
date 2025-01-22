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
			className="bg-center bg-cover shadow-lg rounded-md hover:shadow-xl overflow-hidden flex flex-col items-center justify-between w-full h-80 p-4"
		>
			<h3 className="bg-brand-paper px-4">{city}</h3>
			<div className="p-4 text-center">
				<p className="text-gray-500 bg-brand-paper">{date}</p>
				<button
					type="button"
					onClick={onClick}
					className="mt-8 bg-brand-paper text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
				>
					View Agenda
				</button>
			</div>
		</div>
	);
};

export default CityCard;
