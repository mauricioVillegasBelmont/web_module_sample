import { LitElement, html, css, unsafeCSS, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";

import userContext, {
  UserCalculatorData,
} from "context/UserContext/UserContext";
import configContext, {
  CalculatorConfigData,
} from "context/ConfigContext/ConfigContext";

import styles from "./CalculadoraForeground.scss";

import step_0 from "assets/calculadora__bush--0.svg";
import step_1 from "assets/calculadora__bush--1.svg";
import step_2 from "assets/calculadora__bush--2.svg";
import step_3 from "assets/calculadora__bush--3.svg";
import step_4 from "assets/calculadora__bush--4.svg";
import step_5 from "assets/calculadora__bush--5.svg";


@customElement("calculadora-foreground")
class CalculadoraForeground extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];
  @consume({ context: userContext, subscribe: true })
  contextValue?: UserCalculatorData;

  @consume({ context: configContext, subscribe: true })
  configValue: CalculatorConfigData = {
    minInvest: 500,
    maxInvest: 20000,
    maxAge: 65,
    ageStep: 1,
  };

  get step() {
    const steps = [step_0, step_1, step_2, step_3, step_4, step_5];
    const invest_modulus =
      (this.configValue.maxInvest -
        (this.contextValue as UserCalculatorData).investment) /
      5;
    let index = 0;
    for (index; index < 5; index++) {
      if (
        (this.contextValue as UserCalculatorData).investment -
          this.configValue.minInvest <=
        invest_modulus * index
      )
        break;
    }
    return steps[index];
  }

  render() {
    return html`<div class="foreground">
      <div class="dynamic__image">
        <img src="${this.step}" alt="" class="" width="90" height="290" />
      </div>
    </div>`;
  }
}
