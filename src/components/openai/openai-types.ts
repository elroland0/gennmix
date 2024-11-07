export const models = ["dall-e-3-standard", "dall-e-3-hd", "dall-e-2"] as const;
export type Model = (typeof models)[number];

export const sizes = {
  "dall-e-2": ["1024x1024", "512x512", "256x256"],
  "dall-e-3-standard": ["1792x1024", "1024x1792", "1024x1024"],
  "dall-e-3-hd": ["1792x1024", "1024x1792", "1024x1024"],
} as const;
export type Size = (typeof sizes)[keyof typeof sizes][number];

export const styles = ["vivid", "natural"] as const;
export type Style = (typeof styles)[number];
