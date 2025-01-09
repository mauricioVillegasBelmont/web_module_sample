import { createContext } from "@lit/context";

const user = Symbol("user");
export interface UserCalculatorData {
  age: number;
  investment: number;
}

const userContext = createContext<UserCalculatorData>(user);
export default userContext;
