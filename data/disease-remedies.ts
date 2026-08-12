export type DiseaseInfo = {
  remedy: string
  prevention: string
  severity: 'Low' | 'Medium' | 'High'
  actions: string[]
  fertilizerAdvice: string
}

export const diseaseRemedies: Record<string, DiseaseInfo> = {
  'Tomato___Late_blight': {
    remedy:
      'Remove heavily infected leaves and improve airflow around plants.',
    prevention:
      'Avoid prolonged leaf wetness and maintain adequate spacing.',
    severity: 'High',
    actions: [
      'Inspect surrounding plants',
      'Remove severely affected leaves',
      'Improve field ventilation',
      'Re-scan the crop after treatment',
    ],
    fertilizerAdvice:
      'Avoid excessive nitrogen. Maintain balanced plant nutrition.',
  },

  'Tomato___Early_blight': {
    remedy:
      'Remove affected foliage and maintain good field sanitation.',
    prevention:
      'Avoid overhead irrigation and remove infected plant debris.',
    severity: 'Medium',
    actions: [
      'Remove infected leaves',
      'Clean affected area',
      'Avoid overhead irrigation',
      'Perform a follow-up scan',
    ],
    fertilizerAdvice:
      'Maintain balanced nutrition and avoid excessive nitrogen.',
  },

  'healthy': {
    remedy:
      'No disease treatment is required. Continue regular crop monitoring.',
    prevention:
      'Maintain proper irrigation, nutrition and field sanitation.',
    severity: 'Low',
    actions: [
      'Continue regular monitoring',
      'Maintain irrigation schedule',
      'Monitor surrounding plants',
    ],
    fertilizerAdvice:
      'Continue crop-specific balanced nutrition.',
  },
}