import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../../data/portfolioData';

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const HOME_URL = 'portfolio://home';
const SOCIAL_URL_PREFIX = 'portfolio://social/';
const IFRAME_FALLBACK_DELAY_MS = 2500;
const SEARCH_PROVIDER_LABEL = 'Wikipedia';
const RICKROLL_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const LIKE_A_PRAYER_URL = 'https://www.youtube.com/watch?v=79fzeNUqQbQ';

const SOCIAL_PAGE_CONFIG = {
  facebook: {
    label: 'Facebook',
    accentClassName: 'from-[#3b5998] to-[#284f9f]',
    description: 'Shortcut opened from the IE search bar. Replace the configured Facebook URL to point this page at your actual account.',
    defaultUrl: 'https://www.facebook.com/',
  },
  x: {
    label: 'X',
    accentClassName: 'from-[#505050] to-[#111111]',
    description: 'Shortcut opened from the IE search bar. Replace the configured X URL to point this page at your actual account.',
    defaultUrl: 'https://x.com/',
  },
  messenger: {
    label: 'Messenger',
    accentClassName: 'from-[#1f7bf2] to-[#7a37ff]',
    description: 'Shortcut opened from the IE search bar. Replace the configured Messenger URL to point this page at your actual account or chat link.',
    defaultUrl: 'https://www.messenger.com/',
  },
  instagram: {
    label: 'Instagram',
    accentClassName: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    description: 'Shortcut opened from the IE search bar. Replace the configured Instagram URL to point this page at your actual account.',
    defaultUrl: 'https://www.instagram.com/',
  },
};

const SEARCH_SHORTCUTS = {
  facebook: `${SOCIAL_URL_PREFIX}facebook`,
  x: `${SOCIAL_URL_PREFIX}x`,
  messenger: `${SOCIAL_URL_PREFIX}messenger`,
  messanger: `${SOCIAL_URL_PREFIX}messenger`,
  instagram: `${SOCIAL_URL_PREFIX}instagram`,
  yt: RICKROLL_URL,
  youtube: RICKROLL_URL,
  pornhub: LIKE_A_PRAYER_URL,
};

const SOCIAL_MOCK_CONTENT = {
  facebook: {
    navItems: ['Home', 'Profile', 'Friends', 'Photos'],
    intro: 'A profile-style mock page inside Internet Explorer, designed to feel closer to early social browsing without relying on blocked embeds.',
    highlightTitle: 'About Jan Manuel',
    highlightBody: 'Front-end developer building polished interfaces, portfolio experiments, and practical project work while studying Computer Science.',
    activityTitle: 'Recent Activity',
    activityItems: [
      'Updated the Windows XP portfolio with custom desktop apps and an in-browser picture folder.',
      'Worked on Adventure Quest scenes and level layout experiments in Godot.',
      'Polished responsive project showcases for portfolio and freelance work.',
    ],
    sideTitle: 'Profile Snapshot',
    sideRows: [
      ['Name', portfolioData.profile.name],
      ['Role', portfolioData.profile.role],
      ['Location', portfolioData.profile.location],
    ],
    actionLabel: 'Visit Facebook Profile',
  },
  messenger: {
    navItems: ['Inbox', 'Pinned', 'Media', 'Settings'],
    intro: 'A Messenger-inspired mock conversation view that stays entirely inside the IE window.',
    highlightTitle: 'Pinned Conversation',
    highlightBody: 'This mock page makes the shortcut feel alive while still respecting the fact that Messenger blocks iframe embedding.',
    activityTitle: 'Messages',
    activityItems: [
      'Jan: Hi! Thanks for checking the portfolio.',
      'Visitor: The XP shell looks clean. What was built with React?',
      'Jan: The desktop, windows, IE mock pages, and app interactions are all custom React components.',
    ],
    sideTitle: 'Quick Details',
    sideRows: [
      ['Status', 'Active'],
      ['Primary Use', 'Portfolio contact shortcut'],
      ['Theme', 'Classic blue Messenger mock'],
    ],
    actionLabel: 'Open Messenger Link',
  },
  instagram: {
    navItems: ['Feed', 'Reels', 'Profile', 'Saved'],
    intro: 'An Instagram-style mock profile page for the in-window IE experience.',
    highlightTitle: '@ziim_69',
    highlightBody: 'A compact profile mock with gallery-style cards so the shortcut feels like a real destination inside the portfolio browser.',
    activityTitle: 'Highlights',
    activityItems: [
      'Pixel-inspired layouts and nostalgic UI details.',
      'Front-end builds, project snapshots, and design experiments.',
      'Game dev progress and interface studies.',
    ],
    sideTitle: 'Profile Stats',
    sideRows: [
      ['Posts', '12+'],
      ['Focus', 'UI, projects, experiments'],
      ['Handle', '@ziim_69'],
    ],
    actionLabel: 'Open Instagram Profile',
  },
};

function OldInstagramMock({ socialPageConfig, socialMockContent, socialTargetUrl, openExternal }) {
  const galleryCards = [
    'XP desktop experiments',
    'Adventure Quest scene',
    'Portfolio interface pass',
    'Freelance website snapshot',
    'React component study',
    'Mobile UI concept',
    'Game dev milestone',
    'Design reference board',
    'Project polish notes',
  ];

  return (
    <div className="mx-auto min-h-full max-w-[430px] bg-[#efefef] font-['Tahoma'] text-[#333]">
      <div className="border-b border-[#18365e] bg-linear-to-b from-[#4d80b7] via-[#2d5f92] to-[#214c78] px-3 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="flex items-center justify-between">
          <button type="button" className="rounded border border-[#21456c] bg-linear-to-b from-[#6c94bf] to-[#355e88] px-3 py-1 text-[12px] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">Explore</button>
          <div className="text-[18px] font-bold tracking-wide">INSTAGRAM</div>
          <div className="flex h-7 w-8 items-center justify-center rounded border border-[#21456c] bg-linear-to-b from-[#6c94bf] to-[#355e88] text-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">↗</div>
        </div>
      </div>

      <div className="border-x border-[#cfcfcf] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex gap-3">
          <div className="flex h-[86px] w-[86px] items-center justify-center rounded-sm border border-[#c8c8c8] bg-linear-to-br from-[#f7d481] via-[#d56da1] to-[#5b8fd8] p-[3px]">
            <div className="flex h-full w-full items-center justify-center border border-white/70 bg-[#f2e5cf] text-[30px] text-[#3d3d3d]">📷</div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-3 divide-x divide-[#d8d8d8] rounded-sm border border-[#d8d8d8] text-center text-[11px]">
              <div className="px-2 py-2">
                <div className="text-[22px] font-bold text-[#333]">177</div>
                <div className="text-[#7b7b7b]">photos</div>
              </div>
              <div className="px-2 py-2">
                <div className="text-[22px] font-bold text-[#333]">6.4m</div>
                <div className="text-[#7b7b7b]">following</div>
              </div>
              <div className="px-2 py-2">
                <div className="text-[22px] font-bold text-[#333]">0</div>
                <div className="text-[#7b7b7b]">followers</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => socialTargetUrl && openExternal(socialTargetUrl)}
              className="mt-3 w-full rounded-sm border border-[#326897] bg-linear-to-b from-[#59a0db] to-[#226ba8] px-3 py-2 text-[16px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
            >
              Follow
            </button>
          </div>
        </div>

        <div className="mt-3 border-b border-[#dfdfdf] pb-3">
          <div className="text-[13px] font-bold">Instagram</div>
          <div className="mt-1 text-[12px] text-[#5e5e5e]">Photos straight from Instagram HQ!</div>
          <div className="mt-1 text-[12px] text-[#3b6ea8]">bit.ly/onthecouch01</div>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_1fr_1.5fr_20px] overflow-hidden rounded-sm border border-[#d5d5d5] bg-[#f9f9f9] text-[12px] text-[#6b6b6b]">
          <div className="flex items-center justify-center border-r border-[#d5d5d5] py-2 text-[#4b84b7]">▦</div>
          <div className="flex items-center justify-center border-r border-[#d5d5d5] py-2">☰</div>
          <div className="flex items-center justify-center gap-2 border-r border-[#d5d5d5] py-2 font-bold text-[#4d4d4d]">
            <span>📍</span>
            <span>Photo Map</span>
          </div>
          <div className="flex items-center justify-center py-2">›</div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {galleryCards.map((label, index) => (
            <div key={label} className={`aspect-square border border-[#d0d0d0] bg-linear-to-br ${socialPageConfig.accentClassName} p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]`}>
              <div className="flex h-full items-end justify-start bg-white/10 p-1 text-[10px] font-bold leading-3 text-white">
                {index + 1}. {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OldMessengerMock({ socialTargetUrl, openExternal }) {
  const conversationList = [
    {
      name: 'Jeff Bogle',
      preview: 'Hey, so thank you again for every...',
      time: 'Tue',
      active: true,
    },
    {
      name: 'Michael Sitarzewski',
      preview: ':)',
      time: 'Tue',
      active: false,
    },
  ];

  const messages = [
    {
      author: 'Jeff Bogle',
      text: 'Messenger mock layout looks much closer to the old interface now.',
      time: '6/8, 3:42pm',
    },
    {
      author: 'Dave Taylor',
      text: 'Nice. Keep the nostalgic styling but make the portfolio actions clear and usable.',
      time: '6/8, 3:45pm',
    },
  ];

  return (
    <div className="min-h-full bg-[#f1f1f1] font-['Tahoma'] text-[12px] text-[#333]">
      <div className="border-b border-[#1c3c6f] bg-linear-to-b from-[#334c8a] via-[#2b4685] to-[#213a71] px-3 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#fff] text-[16px] font-bold text-[#2c4c8f]">f</div>
            <div className="flex h-7 w-[340px] items-center rounded-sm border border-[#2a4378] bg-white px-2 text-[#5a5a5a]">
              Search Facebook
            </div>
          </div>
          <div className="flex items-center gap-4 text-[12px] font-bold">
            <span>Dave</span>
            <span>Home</span>
            <span>👥</span>
          </div>
        </div>
      </div>

      <div className="grid min-h-[420px] grid-cols-[290px_minmax(0,1fr)] border-x border-[#d7d7d7] bg-white">
        <div className="border-r border-[#d9d9d9] bg-[#fbfbfb]">
          <div className="flex items-center justify-between border-b border-[#e3e3e3] px-4 py-3 text-[13px]">
            <div className="font-bold text-[#444]">Inbox <span className="ml-2 font-normal text-[#888]">Other</span></div>
            <div className="text-[#888]">More ▾</div>
          </div>

          <div className="border-b border-[#ececec] px-4 py-3">
            <div className="flex items-center rounded-sm border border-[#d2d2d2] bg-white px-2 py-1 text-[#9b9b9b]">Search</div>
          </div>

          <div>
            {conversationList.map((conversation) => (
              <div
                key={conversation.name}
                className={`grid grid-cols-[50px_minmax(0,1fr)_36px] items-start gap-3 border-b border-[#ececec] px-4 py-3 ${conversation.active ? 'bg-[#405e9d] text-white' : 'bg-white text-[#333]'}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-sm ${conversation.active ? 'bg-[#203b75]' : 'bg-[#d7dce7]'} text-[14px] font-bold`}>
                  {conversation.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className={`font-bold ${conversation.active ? 'text-white' : 'text-[#1e2b44]'}`}>{conversation.name}</div>
                  <div className={`truncate text-[12px] ${conversation.active ? 'text-white/90' : 'text-[#666]'}`}>{conversation.preview}</div>
                </div>
                <div className={`text-right text-[12px] ${conversation.active ? 'text-white/90' : 'text-[#777]'}`}>{conversation.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] px-6 py-3">
            <div className="text-[18px] font-bold text-[#2c2c2c]">Jeff Bogle</div>
            <div className="flex items-center gap-2 text-[12px]">
              <button type="button" className="rounded-sm border border-[#cfcfcf] bg-[#f7f7f7] px-3 py-1 font-bold">+ New Message</button>
              <span className="rounded-sm border border-[#d5d5d5] bg-[#fafafa] px-2 py-1">◻</span>
              <span className="rounded-sm border border-[#d5d5d5] bg-[#fafafa] px-2 py-1">⚙</span>
              <span className="rounded-sm border border-[#d5d5d5] bg-[#fafafa] px-2 py-1">⌕</span>
            </div>
          </div>

          <div className="px-6 py-6 text-center text-[12px] text-[#a2a2a2]">Conversation started Monday</div>

          <div className="space-y-5 px-6 pb-6">
            {messages.map((message) => (
              <div key={`${message.author}-${message.time}`} className="grid grid-cols-[48px_minmax(0,1fr)_100px] gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#d7dce7] text-[14px] font-bold text-[#2b3d66]">
                  {message.author.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#24448a]">{message.author}</div>
                  <div className="mt-1 rounded-sm bg-[#f5f7fb] px-3 py-2 text-[13px] leading-5 text-[#4d4d4d]">{message.text}</div>
                </div>
                <div className="pt-6 text-right text-[12px] text-[#9a9a9a]">{message.time}</div>
              </div>
            ))}
          </div>

          {socialTargetUrl && (
            <div className="border-t border-[#ececec] px-6 py-3">
              <button
                type="button"
                onClick={() => openExternal(socialTargetUrl)}
                className="rounded-sm border border-[#35558f] bg-linear-to-b from-[#5a7fc5] to-[#36579c] px-4 py-2 text-[12px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              >
                Open Real Messenger Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function looksLikeUrl(value) {
  return value.includes('.') || value.startsWith('http://') || value.startsWith('https://');
}

function getSearchUrl(query) {
  return `https://en.m.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
}

function getShortcutTarget(value) {
  const normalized = value.trim().toLowerCase();
  return SEARCH_SHORTCUTS[normalized] ?? null;
}

function isSocialPage(url) {
  return url.startsWith(SOCIAL_URL_PREFIX);
}

function getSocialKey(url) {
  return url.replace(SOCIAL_URL_PREFIX, '').trim().toLowerCase();
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

    const shortcutTarget = getShortcutTarget(target);
    if (shortcutTarget) {
      target = shortcutTarget;
    }

    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('portfolio://')) {
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
  const isSocialShortcutPage = isSocialPage(currentUrl);
  const socialPageKey = isSocialShortcutPage ? getSocialKey(currentUrl) : null;
  const socialPageConfig = socialPageKey ? SOCIAL_PAGE_CONFIG[socialPageKey] : null;
  const socialProfiles = portfolioData.contacts.socialProfiles ?? {};
  const socialTargetUrl = socialPageKey
    ? (socialProfiles[socialPageKey] || socialPageConfig?.defaultUrl || '')
    : '';
  const socialMockContent = socialPageKey ? SOCIAL_MOCK_CONTENT[socialPageKey] : null;
  const canOpenExternally = !isHomePage && !isSocialShortcutPage && Boolean(currentUrl);
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

  const renderSocialMockPage = () => {
    if (!socialPageConfig) {
      return null;
    }

    if (!socialMockContent) {
      return (
        <div className="h-full overflow-auto bg-white p-5 text-[12px] text-[#1f1f1f]">
          <div className={`mb-4 rounded border border-[#8aa6d8] bg-linear-to-r ${socialPageConfig.accentClassName} p-4 text-white shadow-[inset_1px_1px_rgba(255,255,255,0.15)]`}>
            <div className="text-[24px] font-bold tracking-wide">{socialPageConfig.label}</div>
            <div className="mt-1 text-[12px] text-white/90">In-window shortcut page</div>
          </div>
          <div className="rounded border border-[#d5d5d5] p-4">
            <p className="text-sm">No custom mock layout is configured for this shortcut yet.</p>
          </div>
        </div>
      );
    }

    if (socialPageKey === 'instagram') {
      return (
        <OldInstagramMock
          socialPageConfig={socialPageConfig}
          socialMockContent={socialMockContent}
          socialTargetUrl={socialTargetUrl}
          openExternal={openExternal}
        />
      );
    }

    if (socialPageKey === 'messenger') {
      return <OldMessengerMock socialTargetUrl={socialTargetUrl} openExternal={openExternal} />;
    }

    return (
      <div className="h-full overflow-auto bg-[#f3f6fb] text-[12px] text-[#1f1f1f]">
        <div className={`border-b border-[#8aa6d8] bg-linear-to-r ${socialPageConfig.accentClassName} px-5 py-4 text-white`}>
          <div className="text-[24px] font-bold tracking-wide">{socialPageConfig.label}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            {socialMockContent.navItems.map((item) => (
              <span key={item} className="rounded border border-white/25 bg-white/12 px-2 py-1">{item}</span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded border border-[#c7d3e5] bg-white p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
            <div className={`mb-3 flex h-18 w-18 items-center justify-center rounded border border-[#9fb3d8] bg-linear-to-br ${socialPageConfig.accentClassName} text-[28px] font-bold text-white`}>
              {socialPageConfig.label.slice(0, 1)}
            </div>
            <div className="text-[14px] font-bold text-[#193a7a]">{portfolioData.profile.name}</div>
            <div className="mt-1 text-[11px] text-[#596b88]">{socialMockContent.intro}</div>

            <div className="mt-4 border-t border-[#e3e8f2] pt-3">
              <div className="mb-2 text-[11px] font-bold text-[#003399]">{socialMockContent.sideTitle}</div>
              <div className="space-y-2 text-[11px]">
                {socialMockContent.sideRows.map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[#73829a]">{label}</div>
                    <div className="font-bold text-[#23334f]">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {socialTargetUrl && (
              <button
                type="button"
                onClick={() => openExternal(socialTargetUrl)}
                className="mt-4 w-full border border-[#0b3b8c] bg-linear-to-b from-[#3f8cf3] to-[#1d67d4] px-3 py-1.5 text-[11px] font-bold text-white shadow-[inset_1px_1px_rgba(255,255,255,0.45)] hover:from-[#5a9df6] hover:to-[#2f75df]"
              >
                {socialMockContent.actionLabel}
              </button>
            )}
          </aside>

          <main className="space-y-4">
            <section className="rounded border border-[#c7d3e5] bg-white p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
              <div className="mb-2 text-[14px] font-bold text-[#193a7a]">{socialMockContent.highlightTitle}</div>
              <p className="m-0 text-[12px] leading-5 text-[#2d3a4f]">{socialMockContent.highlightBody}</p>
            </section>

            <section className="rounded border border-[#c7d3e5] bg-white p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
              <div className="mb-3 text-[14px] font-bold text-[#193a7a]">{socialMockContent.activityTitle}</div>
              <div className="space-y-3">
                {socialMockContent.activityItems.map((item, index) => (
                  <div key={`${socialPageKey}-${index}`} className="rounded border border-[#e4eaf5] bg-[#f8fbff] px-3 py-2 text-[12px] leading-5 text-[#314258]">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {socialPageKey === 'instagram' && (
              <section className="rounded border border-[#c7d3e5] bg-white p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
                <div className="mb-3 text-[14px] font-bold text-[#193a7a]">Mock Gallery</div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((card) => (
                    <div key={card} className={`aspect-square rounded border border-[#d8dfea] bg-linear-to-br ${socialPageConfig.accentClassName} p-2 text-white shadow-[inset_1px_1px_rgba(255,255,255,0.18)]`}>
                      <div className="flex h-full items-end text-[11px] font-bold">Post {card}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    );
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
        ) : isSocialShortcutPage && socialPageConfig ? (
          renderSocialMockPage()
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
            : isSocialShortcutPage
              ? `${socialPageConfig?.label ?? 'Social'} shortcut loaded`
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
