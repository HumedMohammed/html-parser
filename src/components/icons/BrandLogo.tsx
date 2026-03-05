import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  withWordmark?: boolean;
  subtitle?: string;
};

export const BrandLogo = ({
  className,
  withWordmark = true,
  subtitle = "Safe HTML editing",
}: BrandLogoProps) => {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="MarkGuard logo"
      >
        <rect x="2" y="2" width="38" height="38" rx="11" fill="#111111" />
        <rect
          x="2"
          y="2"
          width="38"
          height="38"
          rx="11"
          stroke="#E7E5E4"
          strokeOpacity="0.25"
        />
        <path
          d="M12.5 21L17.5 16.5M12.5 21L17.5 25.5M29.5 21L24.5 16.5M29.5 21L24.5 25.5"
          stroke="#FAFAF9"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 13.5V29"
          stroke="#A8A29E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M19.2 23L21 24.8L24 21.8"
          stroke="#FAFAF9"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {withWordmark && (
        <div className="leading-tight">
          <p className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            MarkGuard
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};
