import React from "react";

// A drawn handset rather than the ✆ character (U+2706). That glyph is missing
// or near-invisible in several common system fonts, and it renders at a weight
// nothing else on the page matches -- on the mobile nav it read as a smudge.
// An SVG looks the same everywhere and takes its colour from the element, so it
// works on the navy bars and on white without a second copy.
export default function PhoneIcon({ size = 14, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
         focusable="false" style={{ flexShrink: 0, ...style }}>
      <path
        d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z"
        fill="currentColor"
      />
    </svg>
  );
}
