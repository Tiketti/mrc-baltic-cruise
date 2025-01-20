import { useState } from 'react';
import CityCard from './components/CityCard';
import { Dialog } from './components/Dialog';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Logo } from './components/Logo';
import { cities } from './Cities';

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div className='flex flex-col space-y-8'>
      <Dialog
        open={!!selectedCity}
        onOpenChange={() => setSelectedCity(null)}
        title={selectedCity?.toLocaleUpperCase() || ''}
        content={
          cities.find(
            ({ name }) => name.toUpperCase() === selectedCity?.toUpperCase()
          )?.agenda
        }
      />
      <Header />
      <Logo />
      <div className='flex flex-col md:flex-col space-y-8 md:space-x-8 md:w-full items-center'>
        <h2 className='text-4xl w-full inline-flex justify-center md:pl-8'>
          Our itinerary
        </h2>
        <div className='flex flex-col w-full md:flex-row md:space-x-8 space-y-8 md:space-y-0 md:px-8'>
          {cities.map(({ name, date, imageUrl }) => (
            <CityCard
              key={name}
              city={name}
              date={date}
              imageUrl={imageUrl}
              onClick={() => setSelectedCity(name)}
            />
          ))}
        </div>
      </div>
      <div className='flex justify-center'>
        <a
          href='https://www.strava.com/clubs/315734/group_events/1892944'
          className='inline-flex items-center gap-1 bg-brand-paper p-4 h-min'
          target='_blank'
          rel='noreferrer'
        >
          <img src='assets/strava-seeklogo.svg' alt='Logo' className='h-6' />
          <span className='text-brand-burgundy border-b hover:border-dashed border-brand-burgundy font-semibold text-xl'>
            Strava event
          </span>
        </a>
      </div>
      <Footer />
    </div>
  );
}

export default App;
