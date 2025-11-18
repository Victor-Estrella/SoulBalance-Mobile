import * as yup from 'yup';

export const wellbeingSchema = yup.object({
  mood: yup.number().min(1).max(5).required(),
  energy: yup.number().min(1).max(5).required(),
  focus: yup.number().min(1).max(5).required(),
  heartRate: yup.number().min(30).max(220).optional(),
  sleepHours: yup.number().min(0).max(24).optional(),
  activityMinutes: yup.number().min(0).max(1800).optional(),
});
