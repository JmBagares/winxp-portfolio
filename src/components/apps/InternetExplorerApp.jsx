import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../../data/portfolioData';

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const HOME_URL = 'portfolio://home';
const IFRAME_FALLBACK_DELAY_MS = 2500;
const SEARCH_PROVIDER_LABEL = 'Wikipedia';

function looksLikeUrl(value) {
  return value.includes('.') || value.startsWith('http://') || value.startsWith('https://');
}

function getSearchUrl(query) {
  return `https://en.m.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
}

function isYouTubeDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be');
  } catch {
    return false;
  }
}

function getEmbedUrl(url) {
  const match = url.match(YOUTUBE_REGEX);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  }
  return null;
}

function isYouTube(url) {
  return YOUTUBE_REGEX.test(url);
}

export default function InternetExplorerApp() {
  const [addressBar, setAddressBar] = useState(HOME_URL);
  const [currentUrl, setCurrentUrl] = useState(HOME_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showExternalFallback, setShowExternalFallback] = useState(false);
  const [history, setHistory] = useState([HOME_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef(null);

  const navigate = (url) => {
    let target = url.trim();
    if (!target) {
      return;
    }

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (!looksLikeUrl(target)) {
        target = getSearchUrl(target);
      } else {
        target = `https://${target}`;
      }
    }

    setCurrentUrl(target);
    setAddressBar(target);
    setIsLoading(true);
    setHasError(false);
    setShowExternalFallback(false);
    const newHistory = [...history.slice(0, historyIndex + 1), target];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prev);
      setAddressBar(prev);
      setIsLoading(true);
      setHasError(false);
      setShowExternalFallback(false);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(next);
      setAddressBar(next);
      setIsLoading(true);
      setHasError(false);
      setShowExternalFallback(false);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setHasError(false);
    setShowExternalFallback(false);
    // Force iframe reload by toggling
    setCurrentUrl('');
    setTimeout(() => setCurrentUrl(currentUrl), 50);
  };

  const handleLoad = () => setIsLoading(false);

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setShowExternalFallback(true);
  };

  const embedUrl = isYouTube(currentUrl) ? getEmbedUrl(currentUrl) : null;
  const isHomePage = currentUrl === HOME_URL;
  const canOpenExternally = !isHomePage && Boolean(currentUrl);
  const isBlockedYouTubeShell = !embedUrl && isYouTubeDomain(currentUrl);

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!isLoading || hasError || isHomePage || embedUrl) {
      setShowExternalFallback(false);
      return undefined;
    }

    const fallbackTimer = window.setTimeout(() => {
      setShowExternalFallback(true);
    }, IFRAME_FALLBACK_DELAY_MS);

    return () => window.clearTimeout(fallbackTimer);
  }, [embedUrl, hasError, isHomePage, isLoading, currentUrl]);

  const handleLoadComplete = () => {
    handleLoad();
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-['Tahoma'] select-none text-[11px]">

      {/* Menu Bar */}
      <div className="flex space-x-4 border-b border-[#aca899] bg-[#ece9d8] px-2 py-0.5 text-[11px]">
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
          <span key={m} className="cursor-default rounded-xs px-1 py-px hover:bg-[#316ac5] hover:text-white">{m}</span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-1 py-1 border-b border-[#aca899] bg-[#ece9d8]">
        {/* Back */}
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="flex flex-col items-center rounded-xs px-2 py-1 disabled:opacity-40 hover:enabled:bg-[#d4d0c8] hover:enabled:shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.4)] active:shadow-[inset_1px_1px_rgba(0,0,0,0.5)]"
          title="Back"
        >
          <svg width="20" height="16" viewBox="0 0 20 16"><path d="M8 2 L2 8 L8 14 L8 10 Q14 9 16 14 Q14 4 8 6 Z" fill="#4080c0"/></svg>
          <span className="text-[9px] leading-none">Back</span>
        </button>
        {/* Forward */}
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="flex flex-col items-center rounded-xs px-2 py-1 disabled:opacity-40 hover:enabled:bg-[#d4d0c8] hover:enabled:shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.4)]"
          title="Forward"
        >
          <svg width="20" height="16" viewBox="0 0 20 16"><path d="M12 2 L18 8 L12 14 L12 10 Q6 9 4 14 Q6 4 12 6 Z" fill="#4080c0"/></svg>
          <span className="text-[9px] leading-none">Forward</span>
        </button>
        {/* Stop */}
        <button
          onClick={() => setIsLoading(false)}
          className="flex flex-col items-center rounded-xs px-2 py-1 hover:bg-[#d4d0c8] hover:shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.4)]"
        >
          <svg width="20" height="16" viewBox="0 0 20 16"><line x1="4" y1="4" x2="16" y2="12" stroke="red" strokeWidth="2"/><line x1="16" y1="4" x2="4" y2="12" stroke="red" strokeWidth="2"/></svg>
          <span className="text-[9px] leading-none">Stop</span>
        </button>
        {/* Refresh */}
        <button
          onClick={refresh}
          className="flex flex-col items-center rounded-xs px-2 py-1 hover:bg-[#d4d0c8] hover:shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.4)]"
        >
          <svg width="20" height="16" viewBox="0 0 20 16"><path d="M10 3 A6 6 0 0 1 16 9" stroke="#007700" fill="none" strokeWidth="2"/><polygon points="16,5 16,9 12,9" fill="#007700"/><path d="M10 13 A6 6 0 0 1 4 7" stroke="#007700" fill="none" strokeWidth="2"/><polygon points="4,11 4,7 8,7" fill="#007700"/></svg>
          <span className="text-[9px] leading-none">Refresh</span>
        </button>
        {/* Home */}
        <button
          onClick={() => navigate(HOME_URL)}
          className="flex flex-col items-center rounded-xs px-2 py-1 hover:bg-[#d4d0c8] hover:shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.4)]"
        >
          <svg width="20" height="16" viewBox="0 0 20 16"><path d="M10 2 L3 9 L5 9 L5 14 L9 14 L9 11 L11 11 L11 14 L15 14 L15 9 L17 9 Z" fill="#f0a020"/></svg>
          <span className="text-[9px] leading-none">Home</span>
        </button>

        <div className="mx-1 h-8 w-px bg-[#aca899]"/>

        {/* Address bar */}
        <div className="flex items-center flex-1 gap-1">
          <span className="text-[11px] shrink-0">Address</span>
          <div className="flex flex-1 border border-[#7f9db9] bg-white shadow-[inset_1px_1px_rgba(0,0,0,0.1)] items-center h-6 px-1">
            <span className="mr-1 text-[10px]">🌐</span>
            <input
              className="flex-1 outline-none text-[11px] bg-transparent"
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(addressBar)}
              spellCheck={false}
            />
          </div>
          <button
            onClick={() => navigate(addressBar)}
            className="px-3 h-6 bg-[#ece9d8] border border-[#aca899] shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.2)] hover:bg-[#d4d0c8] text-[11px]"
          >
            Go
          </button>
        </div>

        {/* IE Globe spinner */}
        <div className="ml-2 w-8 h-8 flex items-center justify-center">
          {isLoading
            ? <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"/>
            : <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1060c0" opacity="0.8"/><ellipse cx="12" cy="12" rx="5" ry="10" fill="none" stroke="#60aaff" strokeWidth="1"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#60aaff" strokeWidth="1"/></svg>
          }
        </div>
      </div>

      {/* Status bar & content */}
      <div className="flex-1 overflow-hidden relative">
        {isHomePage ? (
          <div className="h-full overflow-auto bg-white p-5 text-[12px] text-[#1f1f1f]">
            <div className="mb-4 rounded border border-[#9db9e8] bg-[#eef4ff] p-4">
              <h2 className="mb-1 text-xl font-bold text-[#003399]">{portfolioData.profile.name}</h2>
              <p className="mb-2 text-sm font-semibold text-[#215dc6]">{portfolioData.profile.role}</p>
              <p className="text-sm leading-relaxed">{portfolioData.profile.summary}</p>
            </div>

            <div className="mb-4 rounded border border-[#aca899] bg-[#fff7d6] p-3 text-[11px] leading-relaxed text-[#4f3d00]">
              <p className="font-bold text-[#7a5600]">About this browser</p>
              <p className="mt-1">This Internet Explorer window can only display pages that allow being embedded in an iframe. Major sites such as Google and most full browser experiences block this with X-Frame-Options or Content-Security-Policy.</p>
              <p className="mt-1">Search queries are routed through {SEARCH_PROVIDER_LABEL} because it provides an embeddable results page. Direct YouTube video links can be converted into an embedded player, but normal YouTube browsing still opens better in a real tab.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded border border-[#d5d5d5] p-4">
                <h3 className="mb-2 text-sm font-bold text-[#003399]">Quick Links</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <button type="button" onClick={() => openExternal(portfolioData.contacts.website)} className="text-left text-[#215dc6] underline">Website</button>
                  <button type="button" onClick={() => openExternal(portfolioData.contacts.github)} className="text-left text-[#215dc6] underline">GitHub</button>
                  <button type="button" onClick={() => openExternal(portfolioData.contacts.linkedin)} className="text-left text-[#215dc6] underline">LinkedIn</button>
                  <button type="button" onClick={() => openExternal(`mailto:${portfolioData.contacts.email}`)} className="text-left text-[#215dc6] underline">E-mail</button>
                </div>
              </section>

              <section className="rounded border border-[#d5d5d5] p-4">
                <h3 className="mb-2 text-sm font-bold text-[#003399]">Contact</h3>
                <p className="mb-2 text-sm">{portfolioData.contacts.message}</p>
                <p className="text-sm"><strong>E-mail:</strong> {portfolioData.contacts.email}</p>
                <p className="text-sm"><strong>Location:</strong> {portfolioData.profile.location}</p>
              </section>
            </div>

            <section className="mt-4 rounded border border-[#d5d5d5] p-4">
              <h3 className="mb-3 text-sm font-bold text-[#003399]">Try It</h3>
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <button type="button" onClick={() => navigate('portfolio projects')} className="text-left text-[#215dc6] underline">Search for &quot;portfolio projects&quot;</button>
                <button type="button" onClick={() => navigate('https://example.com')} className="text-left text-[#215dc6] underline">Open example.com</button>
                <button type="button" onClick={() => navigate('https://en.m.wikipedia.org/wiki/Windows_XP')} className="text-left text-[#215dc6] underline">Open a Wikipedia article</button>
                <button type="button" onClick={() => navigate('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} className="text-left text-[#215dc6] underline">Open a YouTube video URL</button>
              </div>
            </section>

            <section className="mt-4 rounded border border-[#d5d5d5] p-4">
              <h3 className="mb-3 text-sm font-bold text-[#003399]">Project Highlights</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {portfolioData.projects.slice(0, 4).map((project) => (
                  <div key={project.title} className="rounded border border-[#e6e6e6] bg-[#fafcff] p-3">
                    <h4 className="font-bold text-[#215dc6]">{project.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed">{project.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : hasError ? (
          // Classic IE "Cannot display" error page
          <div className="h-full bg-white flex flex-col items-center justify-start p-8 overflow-auto">
            <div className="max-w-lg w-full">
              <h2 className="text-2xl text-red-700 font-normal mb-4" style={{fontFamily: 'Times New Roman, serif'}}>
                The page cannot be displayed
              </h2>
              <hr className="border-gray-400 mb-4"/>
              <p className="text-sm mb-4" style={{fontFamily: 'Arial, sans-serif'}}>
                The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.
              </p>
              <div className="bg-[#ece9d8] border border-[#aca899] p-4 text-sm" style={{fontFamily: 'Arial, sans-serif'}}>
                <p className="font-bold mb-2">Please try the following:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Click the <span className="text-blue-600 cursor-pointer" onClick={refresh}>Refresh</span> button, or try again later.</li>
                  <li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
                  <li>This site may block embedding in other pages (X-Frame-Options).</li>
                  <li>Sites can also block iframe access through Content-Security-Policy.</li>
                  <li>Privacy tools such as Brave Shields may block sandboxed content before it can load here.</li>
                  <li>Try a YouTube video URL to watch videos directly!</li>
                </ul>
              </div>
              {canOpenExternally && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openExternal(currentUrl)}
                    className="border border-[#0b3b8c] bg-linear-to-b from-[#3f8cf3] to-[#1d67d4] px-3 py-1 text-sm font-bold text-white shadow-[inset_1px_1px_rgba(255,255,255,0.45)] hover:from-[#5a9df6] hover:to-[#2f75df]"
                  >
                    Open externally
                  </button>
                  <button
                    type="button"
                    onClick={refresh}
                    className="border border-[#8d8d8d] bg-[#ece9d8] px-3 py-1 text-sm shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.2)] hover:bg-[#e1ddcd]"
                  >
                    Try again
                  </button>
                </div>
              )}
              <p className="mt-4 text-[11px] text-gray-600">
                💡 <strong>Tip:</strong> Paste a YouTube URL like <code className="bg-gray-100 px-1">https://www.youtube.com/watch?v=dQw4w9WgXcQ</code> and click Go to watch videos!
              </p>
            </div>
          </div>
        ) : embedUrl ? (
          // YouTube embed player
          <iframe
            key={embedUrl}
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="YouTube Player"
            onLoad={handleLoadComplete}
          />
        ) : (
          // Normal iframe
          <>
            {isBlockedYouTubeShell && (
              <div className="absolute left-3 right-3 top-3 z-10 border border-[#c99d2f] bg-[#fff4ce] px-3 py-2 text-[11px] text-[#4f3d00] shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    The full YouTube site does not embed reliably here. Paste a direct video URL to use the built-in player, or open YouTube in a new tab.
                  </div>
                  <button
                    type="button"
                    onClick={() => openExternal(currentUrl)}
                    className="shrink-0 border border-[#0b3b8c] bg-linear-to-b from-[#3f8cf3] to-[#1d67d4] px-3 py-1 font-bold text-white shadow-[inset_1px_1px_rgba(255,255,255,0.45)] hover:from-[#5a9df6] hover:to-[#2f75df]"
                  >
                    Open YouTube
                  </button>
                </div>
              </div>
            )}

            {showExternalFallback && canOpenExternally && (
              <div className="absolute left-3 right-3 top-3 z-10 border border-[#c99d2f] bg-[#fff4ce] px-3 py-2 text-[11px] text-[#4f3d00] shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    This page may be blocked from loading inside Internet Explorer. Some sites disallow iframe embedding, and privacy-focused browsers can block sandboxed pages earlier.
                  </div>
                  <button
                    type="button"
                    onClick={() => openExternal(currentUrl)}
                    className="shrink-0 border border-[#0b3b8c] bg-linear-to-b from-[#3f8cf3] to-[#1d67d4] px-3 py-1 font-bold text-white shadow-[inset_1px_1px_rgba(255,255,255,0.45)] hover:from-[#5a9df6] hover:to-[#2f75df]"
                  >
                    Open externally
                  </button>
                </div>
              </div>
            )}

            <iframe
              key={currentUrl}
              ref={iframeRef}
              src={currentUrl}
              className="h-full w-full border-0"
              onLoad={handleLoadComplete}
              onError={handleError}
              title="Internet Explorer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            />
          </>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center border-t border-[#aca899] bg-[#ece9d8] px-2 py-0.5 text-[10px] text-gray-600">
        <div className="flex-1 truncate">
          {hasError
            ? 'Cannot display webpage'
            : isBlockedYouTubeShell
              ? 'YouTube browsing is limited in this window'
            : showExternalFallback
              ? 'Page may be blocked in this browser'
              : isLoading
                ? 'Loading...'
                : 'Done'}
        </div>
        <div className="flex items-center space-x-2 pl-4 border-l border-[#aca899]">
          <span>🔒 Internet</span>
        </div>
      </div>
    </div>
  );
}
