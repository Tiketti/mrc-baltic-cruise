export const Footer = () => {
  return (
    <div className='flex text-center justify-center p-8'>
      <a
        href='https://www.strava.com/clubs/315734/group_events/1892944'
        className='flex items-center gap-1'
        target='_blank'
        rel='noreferrer'
      >
        <img src='assets/strava-seeklogo.svg' alt='Logo' className='h-6' />
        <span className='text-brand-burgundy border-b hover:border-b-2 border-brand-burgundy font-semibold text-xl'>
          Strava event
        </span>
      </a>
    </div>
  );
};
