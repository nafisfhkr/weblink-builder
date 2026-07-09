"use client";

import Link from "next/link";

interface FloatingToolbarProps {
  onAddBlock: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  isMobileView: boolean;
  onToggleMobile: () => void;
  isBackgroundOpen: boolean;
  onToggleBackground: () => void;
  publishButton: React.ReactNode;
}

export default function FloatingToolbar({
  onAddBlock,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isPreviewMode,
  onTogglePreview,
  isMobileView,
  onToggleMobile,
  isBackgroundOpen,
  onToggleBackground,
  publishButton,
}: FloatingToolbarProps) {
  const btnBase =
    "flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-5 z-50 flex items-center justify-center flex-wrap gap-1 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 shadow-2xl w-[92vw] sm:w-auto">
      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className={btnBase + " hover:text-white"}
        title="Kembali ke Dashboard"
        aria-label="Kembali ke Dashboard"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </Link>

      <div className="w-px h-5 bg-zinc-800 mx-0.5" />

      {/* Add Block */}
      <button
        id="toolbar-add-block"
        onClick={onAddBlock}
        className={btnBase + " hover:text-teal-400"}
        title="Tambah Blok"
        aria-label="Tambah Blok"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-0.5" />

      {/* Undo */}
      <button
        id="toolbar-undo"
        onClick={onUndo}
        disabled={!canUndo}
        className={btnBase}
        title="Undo"
        aria-label="Undo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
        </svg>
      </button>

      {/* Redo */}
      <button
        id="toolbar-redo"
        onClick={onRedo}
        disabled={!canRedo}
        className={btnBase}
        title="Redo"
        aria-label="Redo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/>
        </svg>
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-0.5" />

      {/* Preview Mode */}
      <button
        id="toolbar-preview"
        onClick={onTogglePreview}
        className={btnBase + (isPreviewMode ? " text-teal-400 bg-teal-950" : "")}
        title={isPreviewMode ? "Keluar Preview" : "Mode Preview"}
        aria-label={isPreviewMode ? "Keluar Preview" : "Mode Preview"}
      >
        {isPreviewMode ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        )}
      </button>

      {/* Mobile Frame Toggle */}
      <button
        id="toolbar-mobile-toggle"
        onClick={onToggleMobile}
        className={btnBase + (isMobileView ? " text-teal-400 bg-teal-950" : "")}
        title={isMobileView ? "Desktop View" : "Mobile View"}
        aria-label={isMobileView ? "Desktop View" : "Mobile View"}
      >
        {isMobileView ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        )}
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-0.5" />

      {/* Background Settings */}
      <button
        id="toolbar-background"
        onClick={onToggleBackground}
        className={btnBase + (isBackgroundOpen ? " text-teal-400 bg-teal-950" : "")}
        title="Atur Background"
        aria-label="Atur Background"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-0.5" />

      {/* Publish Button (injected from parent) */}
      {publishButton}
    </div>
  );
}
