"use client";

import React from "react";

interface GoogleFontLoaderProps {
  pageSettings?: any;
  blocks?: any[];
}

export default function GoogleFontLoader({ pageSettings, blocks = [] }: GoogleFontLoaderProps) {
  const activeFonts = new Set<string>();

  // Helper to extract clean font name
  function getCleanFontName(fontFamily: string) {
    if (!fontFamily || fontFamily === "inherit") return null;
    const parts = fontFamily.split(",");
    const firstPart = parts[0];
    if (!firstPart) return null;
    let font = firstPart.trim();
    // Remove single/double quotes
    font = font.replace(/['"]/g, "");
    // If it starts with var( or is a standard generic fallback, ignore it
    if (
      font.startsWith("var(") ||
      ["sans-serif", "serif", "monospace", "cursive", "fantasy"].includes(font.toLowerCase())
    ) {
      return null;
    }
    return font;
  }

  // 1. Page settings font
  if (pageSettings?.fontFamily) {
    const cleanFont = getCleanFontName(pageSettings.fontFamily);
    if (cleanFont) activeFonts.add(cleanFont);
  }

  // 2. Blocks fonts
  blocks.forEach((block) => {
    if (block.content?.fontFamily) {
      const cleanFont = getCleanFontName(block.content.fontFamily);
      if (cleanFont) activeFonts.add(cleanFont);
    }
    // Check children inside container block
    if (block.type === "container" && Array.isArray(block.content?.children)) {
      block.content.children.forEach((child: any) => {
        if (child.content?.fontFamily) {
          const cleanFont = getCleanFontName(child.content.fontFamily);
          if (cleanFont) activeFonts.add(cleanFont);
        }
      });
    }
  });

  if (activeFonts.size === 0) return null;

  // Build the Google Fonts link URL
  const fontFamiliesQuery = Array.from(activeFonts)
    .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800`)
    .join("&");

  const href = `https://fonts.googleapis.com/css2?${fontFamiliesQuery}&display=swap`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={href} rel="stylesheet" />
    </>
  );
}
