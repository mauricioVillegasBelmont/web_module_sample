import { LitElement, html, css, unsafeCSS, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { CalculatorConfigData } from "context/ConfigContext/ConfigContext";
import { FromResponseEvent} from "components/CalculadoraForm/CalculadoraForm";


import "components/CalculadoraChart/CalculadoraChart";
import "components/CalculadoraForm/CalculadoraForm";

import "components/CalculadoraForeground/CalculadoraForeground";
import "context/ConfigContext/ConfigContextProvider";
import "context/UserContext/UserContextProvider";
import "components/CalculadoraDisplay/CalculadoraDisplay";

import styles from "main.scss";

import _html from "main.html";

import success from "assets/success.svg"
import error from "assets/error.svg"

@customElement("calculadora-ahorro")
class CalculadoraAhorro extends LitElement {
  constructor() {
    super();
    this.addEventListener("fromResponse", this.setFormState);
  }
  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];
  @property({ attribute: false }) formState: "form" | "success" | "error" =
    "form";
  @property({
    type: Object,
    attribute: "config",
    converter: {
      fromAttribute: (value) => {
        const defaultValue = {
          stepInvest: 500,
          minInvest: 500,
          maxInvest: 20000,
          interestRate: 0.05,
          minAge: 18,
          maxAge: 65,
          ageStep: 1,
        };
        if (value) {
          try {
            const parsedValue = JSON.parse(value);
            return { ...defaultValue, ...parsedValue };
          } catch (e) {
            console.error("Invalid JSON for config:", value);
            return { ...defaultValue };
          }
        }
        return { ...defaultValue };
      },
      toAttribute: (value) => JSON.stringify(value),
    },
  })
  config?: CalculatorConfigData = {
    stepInvest: 500,
    minInvest: 2000,
    maxInvest: 10000,
    interestRate: 0.05,
    minAge: 20,
    maxAge: 65,
    ageStep: 1,
  };
  @property({ type: String }) fontFamily = `sans-serif`;
  @property({ type: String }) action = `/`;
  @property({ type: String }) method = `POST`;

  _dinamicStyles() {
    return css`
      :host {
        font-family: ${unsafeCSS(this.fontFamily)}, sans-serif;
      }
      ::slotted(*) {
        font-family: ${unsafeCSS(this.fontFamily)}, sans-serif;
      }
    `;
  }

  chartHeight = 300;
  protected setFormState(event: Event) {
    const status = (event as FromResponseEvent).detail.status;
    console.log(status);
    this.formState = status;
    this.requestUpdate();
  }
  getFormSatusModule = {
    form: html`<calculadora-form
      .action=${this.action}
      .method=${this.method}
    ></calculadora-form>`,
    success: html`<div class="form___statusmsg success">
      <img src="${success}" class="form__status-icon" />
      <p class="form__submit-message">
        A la brevedad un asesor se pondra en contacto con tigo.
      </p>
    </div>`,
    error: html`<div class="form___statusmsg error">
      <img src="${error}" class="form__status-icon" />
      <p class="form__submit-message">
        !Algo salio mal¡. Intentalo mas tarde nuevamente.
      </p>
    </div>`,
  };
  getFormModule = this.getFormSatusModule[this.formState];

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("formState")) {
      this.getFormModule = this.getFormSatusModule[this.formState];
    }
  }

  render() {
    return html`
      <style>
        ${this._dinamicStyles()}
      </style>
      <config-context .configValue=${this.config}>
        <user-context
          .contextValue=${{
            age: (this.config as CalculatorConfigData).minAge,
            investment: (this.config as CalculatorConfigData).minInvest,
          }}
          configValue=${this.config as CalculatorConfigData}
        >
          <div id="${process.env.dynamic}--calculadora__ahorro">
            <div class="${process.env.dynamic}__calculadora--container">
              <div class="col__display">
                <div class="chart__wrapper">
                  <calculadora-chart></calculadora-chart>
                </div>
                <calculadora-foreground></calculadora-foreground>
              </div>
              <div class="col__interface">
                <div class="display">
                  <calculadora-display></calculadora-display>
                </div>
                <div class="form">
                  ${this.getFormModule}
                </div>
                <p class="note">
                  Los datos presentados son una estimación con fines
                  informativos, los montos pueden cambiar al momento de realizar
                  el ejercicio real.
                </p>
              </div>
            </div>
          </div>
        </user-context>
      </config-context>
    `;
  }
}

/*
npm i @google-web-components/google-chart @lit/context lit
npm i -D css-loader extract-loader file-loader html-loader imagemin-webp-webpack-plugin lit-scss-loader node-sass-utils sass sass-loader to-string-loader ts-loader ts-node tsconfig-paths-webpack-plugin typescript webpack webpack-cli

*/