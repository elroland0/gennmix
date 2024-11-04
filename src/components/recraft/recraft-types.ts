export type Model = "refm1" | "recraft20b" | "recraftv3";

export const sizes = [
  "1024x1024",
  "1024x1365",
  "1024x1536",
  "1024x1820",
  "1024x2048",
  "1024x1434",
  "1024x1280",
  "1024x1707",
  "1280x1024",
  "1365x1024",
  "1434x1024",
  "1536x1024",
  "1707x1024",
  "1820x1024",
  "2048x1024",
] as const;

export type Size = (typeof sizes)[number];

export type Style = {
  base:
    | "realistic_image"
    | "digital illustration"
    | "vector illustration"
    | "icon";
  substyle?: Substyle;
};

export const substyles = [
  "2d_art_poster",
  "3d",
  "80s",
  "glow",
  "grain",
  "hand_drawn",
  "infantile_sketch",
  "kawaii",
  "pixel_art",
  "psychedelic",
  "seamless",
  "voxel",
  "watercolor",
  "broken_line",
  "colored_outline",
  "colored_shapes",
  "colored_shapes_gradient",
  "doodle_fill",
  "doodle_offset_fill",
  "offset_fill",
  "outline",
  "outline_gradient",
  "uneven_fill",
  "70s",
  "cartoon",
  "doodle_line_art",
  "engraving",
  "flat_2",
  "line_art",
  "linocut",
  "b_and_w",
  "enterprise",
  "hard_flash",
  "hdr",
  "motion_blur",
  "natural_light",
  "studio_portrait",
  "line_circuit",
  "2d_art_poster_2",
  "engraving_color",
  "flat_air_art",
  "hand_drawn_outline",
  "handmade_3d",
  "stickers_drawings",
] as const;

export type Substyle = (typeof substyles)[number];
