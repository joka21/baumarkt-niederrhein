"use client";

import Link from "next/link";
import { useState } from "react";

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20" />
    </svg>
  );
}

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.6-8 5.8 0 .7.5 1.2 1.2 1.2h13.6c.7 0 1.2-.5 1.2-1.2C20 16.6 16.4 14 12 14Z" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-sm font-bold text-white">
            BN
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-stone-900 sm:inline">
            Baumarkt Niederrhein
          </span>
        </Link>

        {/* Such-Pille (Airbnb-Stil, segmentiert) */}
        <div className="hidden items-center rounded-full border border-stone-200 bg-white py-1 pl-2 pr-1.5 shadow-sm transition-shadow hover:shadow-md md:flex">
          <button
            type="button"
            className="rounded-full px-4 py-1.5 text-left text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
          >
            <span className="block text-[11px] font-medium text-stone-500">Wo</span>
            Ort suchen
          </button>
          <span className="h-6 w-px bg-stone-200" />
          <button
            type="button"
            className="rounded-full px-4 py-1.5 text-left text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
          >
            <span className="block text-[11px] font-medium text-stone-500">Gewerk</span>
            Auswählen
          </button>
          <span className="h-6 w-px bg-stone-200" />
          <button
            type="button"
            className="rounded-full px-4 py-1.5 text-left text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
          >
            <span className="block text-[11px] font-medium text-stone-500">Termin</span>
            Beliebig
          </button>
          <button
            type="button"
            aria-label="Suchen"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-white transition-colors hover:bg-orange-700"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Rechte Aktionen */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/ratgeber"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 lg:inline-block"
          >
            Ratgeber
          </Link>
          <Link
            href="/fuer-anbieter"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 lg:inline-block"
          >
            Anbieter werden
          </Link>
          <button
            type="button"
            aria-label="Sprache und Region"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 sm:flex"
          >
            <GlobeIcon className="h-5 w-5" />
          </button>

          {/* Benutzer-Menü */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Menü öffnen"
              className="flex items-center gap-2 rounded-full border border-stone-200 py-1.5 pl-3 pr-1.5 text-stone-700 transition-shadow hover:shadow-md"
            >
              <MenuIcon className="h-4 w-4" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-500 text-white">
                <UserIcon className="h-5 w-5" />
              </span>
            </button>

            {menuOpen && (
              <>
                {/* Backdrop zum Schließen */}
                <button
                  type="button"
                  aria-label="Menü schließen"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white py-2 shadow-xl"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-stone-900 hover:bg-stone-50"
                  >
                    Anmelden
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Registrieren
                  </button>
                  <div className="my-2 h-px bg-stone-200" />
                  <Link
                    href="/ratgeber"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Ratgeber
                  </Link>
                  <Link
                    href="/fuer-anbieter"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Anbieter werden
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Hilfe
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
