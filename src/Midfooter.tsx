import { events } from "./data";

export const MidFooter = () => (
  <div
    id="strava"
    className="flex flex-col justify-center min-[700px]:flex-row min-[500px]:flex-wrap"
  >
    {events.map((event) => (
      <a
        key={event.id}
        href={event.url}
        className="my-1 ml-10 inline-flex h-min items-center justify-start gap-1 bg-brand-paper px-3 py-2 min-[700px]:mx-2 min-[700px]:p-4"
        target="_blank"
        rel="noreferrer"
        title={event.title}
      >
        <img
          src="assets/strava-seeklogo.svg"
          alt="Logo"
          className="h-5 min-[700px]:h-6"
        />
        <span className="border-brand-paper border-b font-semibold text-brand-burgundy text-lg hover:border-brand-burgundy min-[700px]:text-xl">
          {event.name}
        </span>
      </a>
    ))}
  </div>
);
