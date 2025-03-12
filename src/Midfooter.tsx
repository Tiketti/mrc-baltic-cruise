export const MidFooter = () => (
  <div
    id="strava"
    className="flex flex-col justify-center min-[500px]:flex-row"
  >
    <a
      href="https://www.strava.com/clubs/315734/group_events/1892944"
      className="inline-flex h-min items-center justify-center gap-1 bg-brand-paper p-4"
      target="_blank"
      rel="noreferrer"
      title="Main Strava event"
    >
      <img src="assets/strava-seeklogo.svg" alt="Logo" className="h-6" />
      <span className="border-brand-paper border-b font-semibold text-brand-burgundy text-xl hover:border-brand-burgundy">
        Main Strava event
      </span>
    </a>
    <a
      href="https://www.strava.com/clubs/302996/group_events/1948062"
      className="inline-flex h-min items-center justify-center gap-1 bg-brand-paper p-4"
      target="_blank"
      rel="noreferrer"
      title="Stockholm event"
    >
      <img src="assets/strava-seeklogo.svg" alt="Logo" className="h-6" />
      <span className="border-brand-paper border-b font-semibold text-brand-burgundy text-xl hover:border-brand-burgundy">
        Stockholm event
      </span>
    </a>
  </div>
);
