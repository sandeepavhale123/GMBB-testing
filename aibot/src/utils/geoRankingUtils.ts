import { useI18nNamespace } from "@/hooks/useI18nNamespace";
// Process distance value to handle Miles units properly
export const processDistanceValue = (
  distanceValue: string,
  unit: string
): number | string => {
  // Handle special Miles cases that include 'mi' suffix
  if (unit === "Miles") {
    switch (distanceValue) {
      case "1mi":
        return "1mi";
      case "5mi":
        return "5mi";
      case "10mi":
        return "10mi";
      default:
        return parseFloat(distanceValue);
    }
  }
  // For Meters, parse normally
  return parseFloat(distanceValue);
};

// Distance options based on unit
export const getDistanceOptions = (unit: string) => {
  if (unit === "Meters") {
    return [
      { value: "100", label: "100 Meter" },
      { value: "200", label: "200 Meter" },
      { value: "500", label: "500 Meter" },
      { value: "1", label: "1 KM" },
      { value: "2.5", label: "2.5 KM" },
      { value: "5", label: "5 KM" },
      { value: "10", label: "10 KM" },
      { value: "25", label: "25 KM" },
    ];
  } else {
    return [
      { value: ".1", label: ".1 Miles" },
      { value: ".25", label: ".25 Miles" },
      { value: ".5", label: ".5 Miles" },
      { value: ".75", label: ".75 Miles" },
      { value: "1mi", label: "1 Miles" },
      { value: "2", label: "2 Miles" },
      { value: "3", label: "3 Miles" },
      { value: "5mi", label: "5 Miles" },
      { value: "8", label: "8 Miles" },
      { value: "10mi", label: "10 Miles" },
    ];
  }
};

// Language options
export const languageOptions = [
  { value: "af", label: "AFRIKAANS" },
  { value: "sq", label: "ALBANIAN" },
  { value: "am", label: "AMHARIC" },
  { value: "ar", label: "ARABIC" },
  { value: "hy", label: "ARMENIAN" },
  { value: "az", label: "AZERBAIJANI" },
  { value: "eu", label: "BASQUE" },
  { value: "be", label: "BELARUSIAN" },
  { value: "bn", label: "BENGALI" },
  { value: "bs", label: "BOSNIAN" },
  { value: "bg", label: "BULGARIAN" },
  { value: "my", label: "BURMESE" },
  { value: "ca", label: "CATALAN" },
  { value: "zh", label: "CHINESE" },
  { value: "zh-CN", label: "CHINESE (SIMPLIFIED)" },
  { value: "zh-HK", label: "CHINESE (HONG KONG)" },
  { value: "zh-TW", label: "CHINESE (TRADITIONAL)" },
  { value: "hr", label: "CROATIAN" },
  { value: "cs", label: "CZECH" },
  { value: "da", label: "DANISH" },
  { value: "nl", label: "DUTCH" },
  { value: "en", label: "ENGLISH" },
  { value: "en-AU", label: "ENGLISH (AUSTRALIAN)" },
  { value: "en-GB", label: "ENGLISH (GREAT BRITAIN)" },
  { value: "et", label: "ESTONIAN" },
  { value: "fa", label: "FARSI" },
  { value: "fi", label: "FINNISH" },
  { value: "fil", label: "FILIPINO" },
  { value: "fr", label: "FRENCH" },
  { value: "fr-CA", label: "FRENCH (CANADA)" },
  { value: "gl", label: "GALICIAN" },
  { value: "ka", label: "GEORGIAN" },
  { value: "de", label: "GERMAN" },
  { value: "el", label: "GREEK" },
  { value: "gu", label: "GUJARATI" },
  { value: "iw", label: "HEBREW" },
  { value: "hi", label: "HINDI" },
  { value: "hu", label: "HUNGARIAN" },
  { value: "is", label: "ICELANDIC" },
  { value: "id", label: "INDONESIAN" },
  { value: "it", label: "ITALIAN" },
  { value: "ja", label: "JAPANESE" },
  { value: "kn", label: "KANNADA" },
  { value: "kk", label: "KAZAKH" },
  { value: "km", label: "KHMER" },
  { value: "ko", label: "KOREAN" },
  { value: "ky", label: "KYRGYZ" },
  { value: "lo", label: "LAO" },
  { value: "lv", label: "LATVIAN" },
  { value: "lt", label: "LITHUANIAN" },
  { value: "mk", label: "MACEDONIAN" },
  { value: "ms", label: "MALAY" },
  { value: "ml", label: "MALAYALAM" },
  { value: "mr", label: "MARATHI" },
  { value: "mn", label: "MONGOLIAN" },
  { value: "ne", label: "NEPALI" },
  { value: "no", label: "NORWEGIAN" },
  { value: "pl", label: "POLISH" },
  { value: "pt", label: "PORTUGUESE" },
  { value: "pt-BR", label: "PORTUGUESE (BRAZIL)" },
  { value: "pt-PT", label: "PORTUGUESE (PORTUGAL)" },
  { value: "pa", label: "PUNJABI" },
  { value: "ro", label: "ROMANIAN" },
  { value: "ru", label: "RUSSIAN" },
  { value: "sr", label: "SERBIAN" },
  { value: "si", label: "SINHALESE" },
  { value: "sk", label: "SLOVAK" },
  { value: "sl", label: "SLOVENIAN" },
  { value: "es", label: "SPANISH" },
  { value: "es-419", label: "SPANISH (LATIN AMERICA)" },
  { value: "sw", label: "SWAHILI" },
  { value: "sv", label: "SWEDISH" },
  { value: "ta", label: "TAMIL" },
  { value: "te", label: "TELUGU" },
  { value: "th", label: "THAI" },
  { value: "tr", label: "TURKISH" },
  { value: "uk", label: "UKRAINIAN" },
  { value: "ur", label: "URDU" },
  { value: "uz", label: "UZBEK" },
  { value: "vi", label: "VIETNAMESE" },
  { value: "zu", label: "ZULU" },
];
