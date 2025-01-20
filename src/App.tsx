import CityCard from './components/CityCard';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Logo } from './components/Logo';

function App() {
  return (
    <div className='flex flex-col space-y-8'>
      <Header />
      <Logo />
      <div className='flex flex-col md:flex-col space-y-8 md:space-x-8 md:w-full items-center'>
        <h2 className='text-4xl w-full inline-flex justify-center md:pl-8'>
          The cities!
        </h2>
        <div className='flex flex-col w-full md:flex-row md:space-x-8 space-y-8 md:space-y-0 md:px-8'>
          <CityCard
            city='Stockholm'
            date='18.4.2025'
            imageUrl='/assets/stockholm.jpg'
            onClick={() => undefined}
          />
          <CityCard
            city='Tallinn'
            date='19.4.2025'
            imageUrl='/assets/tallinn.jpg'
            onClick={() => undefined}
          />
          <CityCard
            city='Helsinki'
            date='20.4.2025'
            imageUrl='/assets/helsinki.jpg'
            onClick={() => undefined}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
