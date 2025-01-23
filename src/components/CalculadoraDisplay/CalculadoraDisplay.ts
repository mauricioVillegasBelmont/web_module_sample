import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import userContext, {
  UserCalculatorData,
} from "context/UserContext/UserContext";
import configContext, {
  CalculatorConfigData,
} from "context/ConfigContext/ConfigContext";

import { calculadora_form_config } from "components/CalculadoraForm/CalculadoraForm";
import styles from "components/CalculadoraDisplay/CalculadoraDisplay.scss";

import step_0 from "assets/calculadora__income--0.svg";
import step_1 from "assets/calculadora__income--1.svg";
import step_2 from "assets/calculadora__income--2.svg";
import step_3 from "assets/calculadora__income--3.svg";
import step_4 from "assets/calculadora__income--4.svg";
import step_5 from "assets/calculadora__income--5.svg";


@customElement("calculadora-display")
class CalculadoraDisplay extends LitElement {
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

  @property() interest_rate = 0.15;

  anualInvestment(years: number): number {
    return (
      years *
      12 *
      ((this.contextValue as UserCalculatorData)?.investment ??
        this.configValue.minInvest)
    );
  }

  get yearsLeft(): number {
    return (
      this.configValue.maxAge -
      ((this.contextValue as UserCalculatorData)?.age ?? 18)
    );
  }
  get subtotal() {
    const yearsLeft = this.yearsLeft;
    const subtotal = this.anualInvestment(yearsLeft);
    return subtotal;
  }

  get total() {
    const total = this.subtotal * (this.interest_rate + 1);
    return total;
  }
  // @property({ attribute: false })
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
    return html`
      <div class="${process.env.dynamic}__display">
        <div class="calculadora__aportation">
          <div class="column">
            <p class="">Total aportaciones:</p>
            <p class="note">(valor a futuro)</p>
          </div>
          <div class="column">
            <p class="bold text--right fs--3">
              $${new Intl.NumberFormat("es-MX").format(this.subtotal)}
            </p>
          </div>
        </div>
        <div class="calculadora__profit">
          <div class="dynamic__image">
            <img src="${this.step}" alt="" class="" height="100" />
          </div>
          <div class="dynamic__info text--right">
            <p class="label">Ganancia:</p>
            <p class="money bold fs--4">
              $${new Intl.NumberFormat("es-MX").format(this.total)}
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
