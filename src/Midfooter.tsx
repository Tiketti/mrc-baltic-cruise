export const MidFooter = () => (
  <div
    id="strava"
    className="flex flex-col min-[500px]:flex-row justify-center"
  >
    <a
      href="https://www.strava.com/clubs/315734/group_events/1892944"
      className="inline-flex items-center justify-center gap-1 bg-brand-paper p-4 h-min"
      target="_blank"
      rel="noreferrer"
      title="Main Strava event"
    >
      <img src="assets/strava-seeklogo.svg" alt="Logo" className="h-6" />
      <span className="text-brand-burgundy border-b border-brand-paper hover:border-brand-burgundy font-semibold text-xl">
        Main Strava event
      </span>
    </a>
    <a
      href="https://www.strava.com/clubs/302996/group_events/1948062"
      className="inline-flex items-center justify-center gap-1 bg-brand-paper p-4 h-min"
      target="_blank"
      rel="noreferrer"
      title="Stockholm event"
    >
      <img src="assets/strava-seeklogo.svg" alt="Logo" className="h-6" />
      <span className="text-brand-burgundy border-b border-brand-paper hover:border-brand-burgundy font-semibold text-xl">
        Stockholm event
      </span>
    </a>
  </div>
);
