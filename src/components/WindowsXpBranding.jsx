import windowsXpLogo from '../assets/18760-256x256x32.png';

export default function WindowsXpBranding({
  className = '',
  textColor = '#111111',
  microsoftColor = '#111111',
  professionLabel,
  professionColor,
  windowsSizeClass = 'text-[5.5rem]',
  xpSizeClass = 'text-[2.8rem]',
  microsoftSizeClass = 'text-[1rem]',
  flagWidthClass = 'w-36',
}) {
  const resolvedProfessionColor = professionColor ?? textColor;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src={windowsXpLogo}
        alt="Windows XP"
        className={`${flagWidthClass} mb-3 object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.22)]`}
        style={{ transform: 'rotate(-8deg)' }}
      />

      <div className="relative flex flex-col items-start leading-none">
        <span
          className={`${microsoftSizeClass} absolute -top-4 left-1.5 tracking-[0.03em]`}
          style={{ color: microsoftColor, fontFamily: 'Tahoma, Segoe UI, sans-serif' }}
        >
          Microsoft
          <sup className="text-[0.55em]">®</sup>
        </span>

        <div className="relative flex items-start">
          <span
            className={`${windowsSizeClass} font-bold tracking-[-0.04em]`}
            style={{
              color: textColor,
              fontFamily: 'Franklin Gothic Medium, Arial Narrow, Arial, sans-serif',
            }}
          >
            Windows
          </span>
          <span
            className={`${xpSizeClass} ml-1.5 pt-3 font-light lowercase`}
            style={{
              color: '#f08f2f',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            xp
          </span>
        </div>

        {professionLabel ? (
          <span
            className="mt-1 pl-0.5 text-[2rem] font-light tracking-[0.18em]"
            style={{
              color: resolvedProfessionColor,
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            {professionLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}