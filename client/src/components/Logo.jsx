const Logo = ({ size = 'md', className = '', showText = false, textClassName = '' }) => {
    // Dimension presets for the brandmark
    const dimensionClasses = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-9 h-9',
        lg: 'w-11 h-11'
    };

    return (
        <div className={`inline-flex items-center gap-2.5 ${className}`}>
            <div
                className={`${dimensionClasses[size] || dimensionClasses.md} flex items-center justify-center transition-transform duration-200 hover:scale-105 shrink-0`}
            >
                {/* 
                  Production-grade EchoSocial Brand Mark:
                  A precision acoustic-waveform conversational beacon.
                  Symbolizes authentic voice, high-signal communication, and resonance.
                */}
                <svg
                    className="w-full h-full drop-shadow-sm select-none"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="echoBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                        <linearGradient id="echoAccentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#e0e7ff" />
                        </linearGradient>
                    </defs>

                    {/* Smooth conversational pebble capsule with acoustic tail */}
                    <path
                        d="M5 8.5C5 5.462 7.462 3 10.5 3H21.5C24.538 3 27 5.462 27 8.5V17.5C27 20.538 24.538 23 21.5 23H13.8L8.7 27.5C7.9 28.2 6.7 27.6 6.7 26.5V23C5.7 22.4 5 21.3 5 20V8.5Z"
                        fill="url(#echoBrandGrad)"
                    />

                    {/* High-fidelity acoustic voice waveform bars (mathematically centered at y=13) */}
                    {/* Bar 1: Entry tone */}
                    <rect x="9.5" y="10" width="2.2" height="6" rx="1.1" fill="url(#echoAccentGrad)" />
                    {/* Bar 2: Harmonic rise */}
                    <rect x="13.2" y="7.5" width="2.2" height="11" rx="1.1" fill="url(#echoAccentGrad)" />
                    {/* Bar 3: Signal crest (peak resonance) */}
                    <rect x="16.9" y="6" width="2.2" height="14" rx="1.1" fill="url(#echoAccentGrad)" />
                    {/* Bar 4: Echo reverberation */}
                    <rect x="20.6" y="9" width="2.2" height="8" rx="1.1" fill="url(#echoAccentGrad)" />
                </svg>
            </div>

            {showText && (
                <span className={`font-bold tracking-tight text-text-primary ${textClassName || 'text-base'}`}>
                    EchoSocial
                </span>
            )}
        </div>
    );
};

export default Logo;
