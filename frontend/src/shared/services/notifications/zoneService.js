import { APP_CONFIG } from '../../../app/config/config';

export function resolveZoneKey(latitude, longitude, cellSize = APP_CONFIG.websocket.zoneCellSizeDegrees) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }
  if (typeof cellSize !== 'number' || cellSize <= 0) {
    return null;
  }

  const latBucket = Math.floor((latitude + 90) / cellSize);
  const lonBucket = Math.floor((longitude + 180) / cellSize);
  return `${latBucket}_${lonBucket}`;
}

export function buildZoneTopic(zoneKey) {
  if (!zoneKey) return null;
  const { zonePrefix, zoneSuffix } = APP_CONFIG.websocket.topics;
  return `${zonePrefix}/${zoneKey}${zoneSuffix}`;
}
