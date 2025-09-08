import engineeringEvaluator from "../stages/discovery/specialists/engineering.evaluator";
import marketingEvaluator from "../stages/discovery/specialists/marketing.evaluator";
import pmEvaluator from "../stages/discovery/specialists/pm.evaluator";
import salesopsEvaluator from "../stages/discovery/specialists/salesops.evaluator";

export type DomainName = 'engineering' | 'marketing' | 'salesops' | 'product';

export const getEvaluationSpecialist = (domainName: string) => {
  switch (domainName) {
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