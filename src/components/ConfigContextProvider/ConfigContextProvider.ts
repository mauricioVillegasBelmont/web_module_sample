import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import configContext, {
  CalculatorConfigData,
} from "context/ConfigContext/ConfigContext";



@customElement("config-context")
class UserContext extends LitElement {
  @provide({ context: configContext })
  @property()
  configValue: CalculatorConfigData = {
    minInvest: 500,
    maxInvest: 20000,
    maxAge: 65,
    ageStep: 1,
  };

  render() {
    return html` <slot></slot> `;
  }
}
