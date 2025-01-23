import { createContext } from "@lit/context";

export interface CalculatorConfigData {
  minInvest: number;
  maxInvest: number;
  maxAge: number;
  ageStep: number;
}
const config = Symbol("config");
const configContext = createContext<CalculatorConfigData>(config);
export default configContext;
