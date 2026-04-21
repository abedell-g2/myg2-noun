import React from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function G2AssistantIcon() {
  return (
    <div style={{ filter: "drop-shadow(0 4px 16px rgba(87,70,178,0.2))" }}>
      <svg width="80" height="80" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 1C33.598 1 43 10.402 43 22C43 33.598 33.598 43 22 43C10.402 43 1 33.598 1 22C1 10.402 10.402 1 22 1Z" fill="white"/>
        <path d="M22 1C33.598 1 43 10.402 43 22C43 33.598 33.598 43 22 43C10.402 43 1 33.598 1 22C1 10.402 10.402 1 22 1Z" fill="url(#paint0_linear_26499_586)" fillOpacity="0.2"/>
        <path d="M22 1C33.598 1 43 10.402 43 22C43 33.598 33.598 43 22 43C10.402 43 1 33.598 1 22C1 10.402 10.402 1 22 1Z" stroke="white" strokeWidth="2"/>
        <path d="M20 18.1514C20.1706 21.3918 22.7596 23.9808 26 24.1514C22.7596 24.3219 20.1705 26.9109 20 30.1514C19.8295 26.9109 17.2404 24.3219 14 24.1514C17.2404 23.9808 19.8294 21.3918 20 18.1514ZM26.5 14.5C26.5853 16.1202 27.8798 17.4147 29.5 17.5C27.8798 17.5853 26.5853 18.8798 26.5 20.5C26.4147 18.8798 25.1202 17.5853 23.5 17.5C25.1202 17.4147 26.4147 16.1202 26.5 14.5Z" fill="#FF492C"/>
        <defs>
          <linearGradient id="paint0_linear_26499_586" x1="39.2708" y1="32.5592" x2="6.46297" y2="7.6943" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5746B2" stopOpacity="0.7"/>
            <stop offset="1" stopColor="#FF492C" stopOpacity="0.7"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const SHORTCUT_CARDS = [
  {
    title: "Get your first reviews",
    description: "Run a Review Contest — set a gift card incentive and share a link.",
    cta: "Start a Review Contest",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill="#fbbf24"
          fillOpacity="0.35"
          stroke="#fbbf24"
          strokeWidth="1.5"
        />
      </svg>
    ),
    iconBg: "#fef9ee",
  },
  {
    title: "Complete your profile",
    description: "Add your logo, product description, and screenshots.",
    cta: "Go to your profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5746b2" strokeWidth="1.75" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="M3 20l4-4 3 3 4-5 4 6" />
      </svg>
    ),
    iconBg: "#f2f0f9",
  },
  {
    title: "See buyer intent data",
    description: "Find out which accounts are actively researching your category right now.",
    cta: "View intent signals",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L4 8.5l2 12h12l2-12z"
          fill="#6366f1"
          fillOpacity="0.15"
          stroke="#6366f1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M4 8.5h16" stroke="#6366f1" strokeWidth="1.5" />
        <path d="M8 8.5L12 2l4 6.5" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    iconBg: "#eef2ff",
  },
];

export function HomeDashboard() {
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ fontFamily: "'Figtree', sans-serif" }}>

      {/* Icon + greeting + prompt — constrained width */}
      <div className="w-full max-w-[780px] px-6 flex flex-col items-center gap-7">

        <G2AssistantIcon />

        {/* Greeting */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "#201f23", lineHeight: 1.2, margin: 0 }}>
            {getGreeting()}, Olivia
          </h1>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#5746b2", lineHeight: 1.2, margin: 0 }}>
            How can I help with your G2 presence?
          </p>
        </div>

        {/* Prompt box */}
        <div
          className="w-full bg-white rounded-2xl"
          style={{ boxShadow: "0 4px 24px rgba(32,31,35,0.10), 0 0 0 1px rgba(32,31,35,0.08)" }}
        >
          <div className="px-5 pt-5 pb-3">
            <p style={{ color: "#9ca3af", fontSize: 15, margin: 0, lineHeight: 1.5 }}>
              Ask about your reviews, profile, analytics, buyer intent data, or how to get started...
            </p>
            <div style={{ height: 48 }} />
          </div>
          <div style={{ height: 1, backgroundColor: "#f3f4f6", marginLeft: 20, marginRight: 20 }} />
          <div className="flex items-center justify-end px-4 py-3">
            <button
              className="flex items-center gap-2 rounded-full px-4 py-2 transition-colors hover:opacity-90"
              style={{ backgroundColor: "#5746b2", fontSize: 13, fontWeight: 600, color: "white" }}
            >
              Ask
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Cards — aligned with prompt width */}
      <div className="w-full max-w-[780px] px-6 mt-7">
        <p
          style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px 0" }}
        >
          Suggested actions
        </p>
        <div className="grid grid-cols-3 gap-4">
          {SHORTCUT_CARDS.map((card) => (
            <button
              key={card.title}
              className="flex flex-col justify-between bg-white rounded-xl p-5 text-left transition-shadow hover:shadow-md"
              style={{ border: "1px solid #e5e7eb", minHeight: 160 }}
            >
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#201f23", lineHeight: 1.4, display: "block" }}>{card.title}</span>
                <span style={{ fontSize: 13, color: "#6f6d78", lineHeight: 1.5, marginTop: 6, display: "block" }}>{card.description}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600, color: "#5746b2" }}>
                  {card.cta}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5746b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
                <span
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 36, height: 36, background: card.iconBg }}
                >
                  {card.icon}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
