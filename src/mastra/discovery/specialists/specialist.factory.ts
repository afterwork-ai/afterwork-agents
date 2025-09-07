import engineeringEvaluator from "./engineering.evaluator";
import marketingEvaluator from "./marketing.evaluator";
import pmEvaluator from "./pm.evaluator";
import salesopsEvaluator from "./salesops.evaluator";

export type SpecialistName = 'engineering' | 'marketing' | 'salesops' | 'product';

export const getSpecialist = (specialistName: string) => {
  switch (specialistName) {
    case 'engineering':
      return engineeringEvaluator;
    case 'marketing':
      return marketingEvaluator;
    case 'salesops':
      return salesopsEvaluator;
    case 'product':
      return pmEvaluator;
  }
};