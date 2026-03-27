interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <header className="sticky top-0 bg-primary p-2 text-center shadow-lg shadow-primary">
      <button
        type="button"
        className="p-2 focus:outline-none focus:ring-2 focus:ring-surface focus:ring-offset-2 focus:ring-offset-primary"
        title="Scroll to top"
        aria-label={`${title} - Click to scroll to top`}
        onClick={scrollToTop}
        onKeyDown={handleKeyDown}
      >
        <h1 className="cursor-pointer text-2xl text-surface tracking-wide sm:text-4xl md:text-5xl">
          {title}
        </h1>
      </button>
    </header>
  );
};
