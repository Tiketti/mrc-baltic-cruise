export const Header = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <header className="sticky top-0 bg-brand-blue p-2 text-center shadow-brand-blue shadow-lg">
      <button
        type="button"
        className="p-2 focus:outline-none focus:ring-2 focus:ring-brand-paper focus:ring-offset-2 focus:ring-offset-brand-blue"
        title="Scroll to top"
        aria-label="MRC Baltic Cruise 2025 - Click to scroll to top"
        onClick={scrollToTop}
        onKeyDown={handleKeyDown}
      >
        <h1 className="cursor-pointer text-2xl text-brand-paper tracking-wide sm:text-4xl md:text-5xl">
          MRC Baltic Cruise 2025
        </h1>
      </button>
    </header>
  );
};
