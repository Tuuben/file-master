export const imageFormats = {
    PNG: "png",
    JPEG: "jpeg",
    BMP: "bmp",
    GIF: "gif",
    TIFF: "tiff",
    WebP: "webp",
    SVG: "svg",
} as const;

export type ImageFormatType = keyof typeof imageFormats;

