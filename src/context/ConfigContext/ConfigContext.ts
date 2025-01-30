import { createContext } from "@lit/context";

export interface CalculatorConfigData {
  stepInvest: number;
  minInvest: number;
  maxInvest: number;
  interestRate: number;
  minAge: number;
  maxAge: number;
  ageStep: number;
}
const config = Symbol("config");
const configContext = createContext<CalculatorConfigData>(config);
export default configContext;
