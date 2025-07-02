// Process distance value to handle Miles units properly
export const processDistanceValue = (distanceValue: string, unit: string): number => {
  // Handle special Miles cases that include 'mi' suffix
  if (unit === 'Miles') {
    switch (distanceValue) {
      case '1mi':
        return 1;
      case '5mi':
        return 5;
      case '10mi':
        return 10;
      default:
        return parseFloat(distanceValue);
    }
  }
  // For Meters, parse normally
  return parseFloat(distanceValue);
};

// Distance options based on unit
export const getDistanceOptions = (unit: string) => {
  if (unit === 'Meters') {
    return [
      { value: '100', label: '100 Meter' },
      { value: '200', label: '200 Meter' },
      { value: '500', label: '500 Meter' },
      { value: '1', label: '1 KM' },
      { value: '2.5', label: '2.5 KM' },
      { value: '5', label: '5 KM' },
      { value: '10', label: '10 KM' },
      { value: '25', label: '25 KM' }
    ];
  } else {
    return [
      { value: '.1', label: '.1 Miles' },
      { value: '.25', label: '.25 Miles' },
      { value: '.5', label: '.5 Miles' },
      { value: '.75', label: '.75 Miles' },
      { value: '1mi', label: '1 Miles' },
      { value: '2', label: '2 Miles' },
      { value: '3', label: '3 Miles' },
      { value: '5mi', label: '5 Miles' },
      { value: '8', label: '8 Miles' },
      { value: '10mi', label: '10 Miles' }
    ];
  }
};

// Language options
export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' }
];