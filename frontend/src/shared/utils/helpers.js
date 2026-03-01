export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function formatDate(date) {
  const dateInstance = date instanceof Date ? date : new Date(date);
  return dateInstance.toLocaleDateString('es-ES');
}

export function calculateDistanceInKm(pointA, pointB) {
  const earthRadiusKm = 6371;
  const latDiff = toRadians(pointB.latitude - pointA.latitude);
  const lonDiff = toRadians(pointB.longitude - pointA.longitude);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(toRadians(pointA.latitude)) *
      Math.cos(toRadians(pointB.latitude)) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
