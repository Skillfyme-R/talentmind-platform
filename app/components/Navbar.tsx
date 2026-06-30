"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

type NavbarProps = {
  onSignIn: () => void;
  onDemo: () => void;
  user: { name: string; email: string } | null;
  onSignOut: () => void;
};

export default function Navbar({ onSignIn, onDemo, user, onSignOut }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-indigo-100"
          : "bg-white/80 backdrop-blur-sm border-b border-indigo-50"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-md">
            <TalentMindIcon />
          </div>
          <span className="font-display font-bold text-[18px] tracking-tight" style={{ color: "#1e1b4b" }}>
            Talent<span style={{ color: "#6366f1" }}>Mind</span>
          </span>
          <span
            className="hidden sm:inline text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{ color: "#6366f1", borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.06)" }}
          >
            AI
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#374151] hover:text-[#4338ca] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA — changes when signed in */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-semibold text-[#1e1b4b] max-w-[120px] truncate">{user.name}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-indigo-100 shadow-xl py-2 animate-slide-up">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-indigo-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1e1b4b] truncate">{user.name}</p>
                        <p className="text-xs text-[#9ca3af] truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-indigo-50 hover:text-[#4338ca] transition-colors">
                      <LayoutDashboard size={15} className="text-indigo-400" />
                      Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-indigo-50 hover:text-[#4338ca] transition-colors">
                      <User size={15} className="text-indigo-400" />
                      My Profile
                    </button>
                  </div>

                  <div className="border-t border-indigo-50 py-1">
                    <button
                      onClick={() => { setDropdownOpen(false); onSignOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="text-sm font-semibold text-[#4338ca] hover:text-[#3730a3] transition-colors px-4 py-2 rounded-full border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50"
              >
                Sign in
              </button>
              <button onClick={onDemo} className="btn-primary text-sm px-5 py-2.5">
                Request Demo
                <ArrowRightIcon />
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-indigo-50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-[#1e1b4b] mb-1 transition-transform" />
          <span className="block w-5 h-0.5 bg-[#1e1b4b] mb-1 transition-transform" />
          <span className="block w-5 h-0.5 bg-[#1e1b4b]" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-indigo-100 shadow-lg animate-fade-in">
          <nav className="flex flex-col px-6 py-4 gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[#374151] hover:text-[#4338ca] py-1.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-indigo-50 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1e1b4b]">{user.name}</p>
                      <p className="text-xs text-[#9ca3af]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); onSignOut(); }}
                    className="btn-outline text-sm py-2.5 justify-center text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMenuOpen(false); onSignIn(); }} className="btn-outline text-sm py-2.5 justify-center">
                    Sign in
                  </button>
                  <button onClick={() => { setMenuOpen(false); onDemo(); }} className="btn-primary text-sm py-2.5 justify-center">
                    Request Demo
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function TalentMindIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="5" r="2.5" fill="white" opacity="0.9" />
      <circle cx="4" cy="13" r="2.5" fill="white" opacity="0.7" />
      <circle cx="14" cy="13" r="2.5" fill="white" opacity="0.7" />
      <line x1="9" y1="7.5" x2="4" y2="10.5" stroke="white" strokeWidth="1.2" opacity="0.6" />
      <line x1="9" y1="7.5" x2="14" y2="10.5" stroke="white" strokeWidth="1.2" opacity="0.6" />
      <line x1="4" y1="13" x2="14" y2="13" stroke="white" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
