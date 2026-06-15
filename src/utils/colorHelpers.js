// ZRC color readability helpers
// Bu dosya v503 ile App.jsx içinden ayrıldı.

export const hexToRgb = (hexColor = '#ffffff') => {
    const cleanHex = hexColor.replace('#', '');

    if (cleanHex.length !== 6) {
      return { red: 255, green: 255, blue: 255 };
    }

    return {
      red: parseInt(cleanHex.slice(0, 2), 16),
      green: parseInt(cleanHex.slice(2, 4), 16),
      blue: parseInt(cleanHex.slice(4, 6), 16)
    };
  };

export const rgbToHsl = ({ red, green, blue }) => {
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue = 0;
    let saturation = 0;
    const lightness = (max + min) / 2;

    if (max !== min) {
      const diff = max - min;
      saturation = lightness > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      if (max === r) hue = (g - b) / diff + (g < b ? 6 : 0);
      if (max === g) hue = (b - r) / diff + 2;
      if (max === b) hue = (r - g) / diff + 4;

      hue /= 6;
    }

    return {
      hue: Math.round(hue * 360),
      saturation: Math.round(saturation * 100),
      lightness: Math.round(lightness * 100)
    };
  };

export const hslToCss = ({ hue, saturation, lightness }) => {
    return `hsl(${hue} ${saturation}% ${lightness}%)`;
  };

export const isLightColor = (hexColor = '#ffffff') => {
    const { red, green, blue } = hexToRgb(hexColor);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

    return brightness > 170;
  };

export const getReadableColumnColor = (hexColor) => {
    const hsl = rgbToHsl(hexToRgb(hexColor));
    const saturation = Math.min(72, Math.max(34, hsl.saturation));

    return hslToCss({
      hue: hsl.hue,
      saturation,
      lightness: isLightColor(hexColor) ? 24 : 92
    });
  };

export const getReadableColumnMutedColor = (hexColor) => {
    const hsl = rgbToHsl(hexToRgb(hexColor));
    const saturation = Math.min(55, Math.max(24, hsl.saturation));

    return hslToCss({
      hue: hsl.hue,
      saturation,
      lightness: isLightColor(hexColor) ? 36 : 84
    });
  };

export const getColumnEditToolsStyle = (hexColor) => {
    return isLightColor(hexColor)
      ? {
          backgroundColor: 'rgba(255,255,255,0.72)',
          color: getReadableColumnColor(hexColor),
          boxShadow: '0 1px 2px rgba(15,23,42,0.10)'
        }
      : {
          backgroundColor: 'rgba(0,0,0,0.22)',
          color: getReadableColumnColor(hexColor),
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)'
        };
  };
