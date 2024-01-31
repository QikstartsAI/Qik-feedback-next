export const degreesToRadians = (degrees: number): number =>
  degrees * (Math.PI / 180);

export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  if (!lat1 || !lat2 || !lon1 || !lon2) return 100000;
  const R = 6371; // radius of the planet

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Kms
  return distance;
};
