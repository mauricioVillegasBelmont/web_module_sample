import { LitElement, html, css,  unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";


import styles from "./CalculadoraForm.scss";

import userContext, { UserCalculatorData } from "context/UserContext/UserContext";
import invalidMsg from "utils/forms/invalidMsg";
import FormSumbiterApi from "api/api";
import configContext, { CalculatorConfigData } from "context/ConfigContext/ConfigContext";


export interface calculadora_form_data extends UserCalculatorData {
  name: string;
  email: string;
  whatsapp: string;
}
export interface FromResponseEvent extends Event, CustomEvent {
  detail: {[status:string]:"success" | "error"};
}


@customElement("calculadora-form")
class CalculadoraForm extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];
  @state() protected _disabled: boolean = true;
  @state() protected errorMessage: string = "";

  @property({ type: String }) action = `/`;
  @property({ type: String }) method = `POST`;

  @property() name = "";
  @property() email = "";
  @property() whatsapp = "";
  @property() age = 0;
  @property() investment = 0;

  @consume({ context: userContext, subscribe: true })
  contextValue?: UserCalculatorData;

  @consume({ context: configContext, subscribe: true })
  configValue: CalculatorConfigData = {
    stepInvest: 500,
    minInvest: 500,
    maxInvest: 20000,
    interestRate: 0.05,
    minAge: 18,
    maxAge: 65,
    ageStep: 1,
  };

  connectedCallback() {
    super.connectedCallback();
    if (this.contextValue) {
      this.age = this.contextValue.age;
      this.investment = this.contextValue.investment;
    }
  }

  updateContext() {
    const event = new CustomEvent("updateContext", {
      detail: { age: this.age, investment: this.investment },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
  fromResponse(status: "success" | "error") {
    const event = new CustomEvent("fromResponse", {
      detail: { status: status },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  async submit(event: Event) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (!form) return;
    this.errorMessage = "";
    this._disabled = true;
    try {
      const data = new FormData(form);
      const action = this.action;
      const method = this.method.toUpperCase();
      const response = await FormSumbiterApi.submit(action, method, data);
      if (response.status !== "ok") {
        this.errorMessage =
          response.msg ?? "Completa el formulario de manera correcta";
      } else {
        this.fromResponse("success");
      }
      // this._disabled = false;
    } catch (error) {
      // this._disabled = false;
      this.fromResponse("error");
    }
  }

  render() {
    return html`
      <form @submit="${this.submit}" class="${process.env.dynamic}__form">
        <div class="${process.env.dynamic}__form--group">
          <label for="age">Edad:</label>
          <span id="age_val">${this.age} años</span>
          <input
            id="age"
            type="range"
            name="age"
            min="${this.configValue.minAge}"
            max="${this.configValue.maxAge - 15}"
            step="${this.configValue.ageStep}"
            .value="${this.age}"
            @input="${this._age_handler}"
          />
        </div>
        <div class="${process.env.dynamic}__form--group">
          <label for="investment">Inversión mensual:</label>
          <span id="investment_val"
            >$${new Intl.NumberFormat().format(this.investment)}</span
          >
          <input
            id="investment"
            type="range"
            name="investment"
            step="${this.configValue.stepInvest}"
            min="${this.configValue.minInvest}"
            max="${this.configValue.maxInvest}"
            .value="${this.investment}"
            @input="${this._investment_handler}"
          />
        </div>
        <div class="${process.env.dynamic}__form--group">
          <input
            id="name"
            type="text"
            name="name"
            value="${this.name}"
            placeholder="Tu nombre:"
            class="input__text c--black"
            autocomplete="name"
            required
            @input="${this._input_handler}"
            @invalid="${this._setInvalidMessage}"
          />
        </div>
        <div class="${process.env.dynamic}__form--group">
          <input
            id="email"
            type="email"
            name="email"
            value=""
            placeholder="Tu correo:"
            class="input__text c--black"
            autocomplete="email"
            required
            @input="${this._input_handler}"
            @invalid="${this._setInvalidMessage}"
          />
        </div>
        <div class="${process.env.dynamic}__form--group">
          <input
            id="phone"
            type="text"
            name="whatsapp"
            value=""
            placeholder="Tu WhatsApp:"
            class="input__text c--black"
            minlength="10"
            maxlength="10"
            required
            pattern="[0-9]{10,10}"
            autocomplete="tel"
            required
            @keydown="${this._numericOnly}"
            @input="${this._input_handler}"
            @invalid="${this._setInvalidMessage}"
          />
        </div>
        <div class="${process.env.dynamic}__form--group">
          ${this.errorMessage}
        </div>
        <div class="${process.env.dynamic}__form--group">
          <button type="submit" ?disabled="${this._disabled}">
            Hablar con un asesor
          </button>
        </div>
      </form>
    `;
  }

  _setInvalidMessage(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const message = invalidMsg(input);
    input.setCustomValidity(message);
  }

  _numericOnly(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (
      !keyboardEvent.metaKey &&
      keyboardEvent.key !== "Backspace" &&
      !/[0-9.]/.test(keyboardEvent.key)
    ) {
      keyboardEvent.preventDefault();
    }
  }

  _input_handler(event: InputEvent) {
    if (
      this.configValue === undefined ||
      (event.currentTarget as HTMLInputElement) === undefined
    )
      return;
    const input = event.currentTarget as HTMLInputElement;
    input.setCustomValidity("");
    const name = input.name as keyof calculadora_form_data;
    const value = input.value;
    if (name === "age" || name === "investment") {
      this[name] = Number(value);
    } else {
      this[name] = String(value);
    }

    if (this.name && this.email && this.whatsapp) {
      this._disabled = false;
    } else {
      this._disabled = true;
    }
  }

  _age_handler(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    this.age = Number(input.value);
    this.updateContext();
  }

  _investment_handler(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    this.investment = Number(input.value);
    this.updateContext();
  }
}
