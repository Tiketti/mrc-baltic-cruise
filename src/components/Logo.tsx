interface LogoProps {
  variant?: "2025" | "2026" | "2027";
}

const logoSrc = {
  "2025": "assets/mrc_baltic_cruise_logo.svg",
  "2026": "assets/mrc_baltic_cruise_logo_2026.png",
  // Reusing the original mark until the 2027 logo exists — it carries no year.
  "2027": "assets/mrc_baltic_cruise_logo.svg",
} as const;

export const Logo = ({ variant = "2025" }: LogoProps) => {
  return (
    <div className="!mt-0 flex justify-center bg-primary p-4">
      <img
        src={logoSrc[variant]}
        alt={`MRC Baltic Cruise Logo ${variant}`}
        className="max-h-[50vh] w-auto"
      />
    </div>
  );
};
