
// Export services without the types to avoid ambiguity
export * from './userPerformanceService';
export { 
  getUserQuizResults, 
  getRecentQuizResults, 
  submitQuizResult,
  getQuizPerformanceByTopic 
} from './quizResultsService';
export * from './learningResourcesService';
export * from './aiRecommendationsService';
export * from './badgeService';
// Export types separately to avoid the ambiguity
export type * from './types';
