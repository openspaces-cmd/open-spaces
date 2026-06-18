import { CircularLogo } from "./CircularLogo";

// Intentional stand-in for photography we don't have yet: brand gradient with a
// faint seal watermark, so empty image slots still read as designed.
export function ImagePlaceholder({
  label,
  className = "",
  sealSize = 200,
}: {
  label?: string;
  className?: string;
  sealSize?: number;
}) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-midnight via-charcoal to-stormy ${className}`}
    >
      <CircularLogo size={sealSize} className="text-ivory-light/10" />
      {label ? (
        <span className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory-light/40">
          {label}
        </span>
      ) : null}
    </div>
  );
}
