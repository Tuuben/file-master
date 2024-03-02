export const imageFormats = {
    PNG: "png",
    JPEG: "jpeg",
    BMP: "bmp",
    GIF: "gif",
    TIFF: "tiff",
    WebP: "webp",
    PGM: "pgm",
    PPM: "ppm",
    PGMYUV: "pgmyuv",
    Targa: "tga",
    SVG: "svg",
    XWD: "xwd",
    DPX: "dpx",
    EXR: "exr",
    PAM: "pam",
    HEIF: "heif",
    HEIC: "heic"
} as const;

export type ImageFormatType = keyof typeof imageFormats;

