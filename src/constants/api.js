// ⚠️ IMPORTANT : Remplace par l'IP de ton ordinateur
// Pour la trouver : ouvre PowerShell et tape "ipconfig"
// Cherche "Adresse IPv4" ex: 192.168.1.42
export const API_BASE_URL = 'http://192.168.1.11:8000/api';

export const ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register/',
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  ME: '/auth/me/',
  PROFILE: '/auth/profile/',
  REFRESH_TOKEN: '/auth/token/refresh/',

  // Cycle
  CYCLES: '/cycle/',
  CYCLE_STATS: '/cycle/statistics/',

  // Logs
  LOGS: '/logs/',
  LOG_TODAY: '/logs/today/',
  LOG_LAST_WEEK: '/logs/last_week/',

  // Médical
  CONSULTATIONS: '/medical/consultations/',
  REMINDERS: '/medical/reminders/',

  // ML
  PREDICT: '/ml/predict/',
};