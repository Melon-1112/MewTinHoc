import { CHUONG_1_QUIZ } from './chuong1.js';

export const QUESTION_BANKS = {
  cs_station_1: CHUONG_1_QUIZ,
  ict_station_1: CHUONG_1_QUIZ
};

export function getStationQuiz(stationId) {
  return QUESTION_BANKS[stationId] || null;
}

export { CHUONG_1_QUIZ };
