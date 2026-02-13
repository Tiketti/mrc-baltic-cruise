import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HostsSection } from "../components/Hosts";
import { Logo } from "../components/Logo";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// TODO: This is a placeholder component for Baltic Cruise 2026
// Design refresh and actual content will be added later
export const BalticCruise2026 = () => {
  useDocumentTitle("MRC Baltic Cruise 2026");

  return (
    <div className="flex flex-col space-y-8">
      <Header />
      <Logo />
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 px-8 md:w-full">
        <div className="max-w-2xl space-y-6 text-center">
          <h1 className="font-bold text-4xl md:text-6xl">
            Baltic Cruise 2026
          </h1>
          <p className="text-xl text-brand-blue md:text-2xl">
            Details coming soon
          </p>
          <p className="text-lg text-brand-blue/80">
            We're planning another incredible journey across the Baltic Sea.
            Stay tuned for dates, cities, and all the details you need to join
            us!
          </p>

          <HostsSection order={["helsinki","stockholm", "tallinn"]} />
          
          <div className="flex flex-col items-center gap-4 pt-4">
            <a
              href="https://www.strava.com/clubs/302996/group_events/3455960626226077518"
              className="inline-flex items-center gap-2 bg-brand-paper px-6 py-3 transition-colors hover:bg-brand-paper/80"
              target="_blank"
              rel="noreferrer"
              title="MRC Baltic Cruise - The Stockholm Run"
            >
              <img
                src="assets/strava-seeklogo.svg"
                alt="Strava Logo"
                className="h-6"
              />
              <span className="border-brand-paper border-b font-semibold text-brand-burgundy text-lg hover:border-brand-burgundy">
                Stockholm Run
              </span>
            </a>
            
            <a
              href="https://www.instagram.com/mrcbalticcruise/"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg bg-brand-burgundy px-8 py-3 font-medium text-brand-paper transition-colors hover:bg-brand-burgundy/90"
            >
              Follow @mrcbalticcruise for updates
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
