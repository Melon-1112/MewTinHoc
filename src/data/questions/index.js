import { CHUONG_1_QUIZ } from './chuong1.js';
import { CHUONG_2_QUIZ } from './chuong2.js';

export const QUESTION_BANKS = {
  cs_station_1: CHUONG_1_QUIZ,
  cs_station_2: CHUONG_2_QUIZ,
  ict_station_1: CHUONG_1_QUIZ
};

export function getStationQuiz(stationId) {
  return QUESTION_BANKS[stationId] || null;
}

export { CHUONG_1_QUIZ, CHUONG_2_QUIZ };
