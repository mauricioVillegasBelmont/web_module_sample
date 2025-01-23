import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import userContext, { UserCalculatorData } from "context/UserContext/UserContext";

export interface UserContextUpdateEvent extends Event {
  detail: UserCalculatorData;
}
export interface UserContextUpdatedEvent extends Event {
  detail: string;
}

@customElement("user-context")
class UserContext extends LitElement {
  constructor() {
    super();
    this.addEventListener("updateContext", this.updateContext);
  }

  @provide({ context: userContext })
  @property()
  contextValue: UserCalculatorData = {
    age: 18,
    investment: 1000,
  };

  private timeoutEvent: number | NodeJS.Timeout | null = null;
  updateContext(event: Event) {
    const newContextValue = (event as UserContextUpdateEvent).detail;
    this.contextValue = newContextValue;
    clearTimeout(this.timeoutEvent as number);
    this.timeoutEvent = setTimeout(() => {
      this.yellUpdated();
    }, 250);
  }
  yellUpdated() {
    const event = new CustomEvent("contextUpdated", {
      detail: (+new Date()).toString(36),
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    return html` <slot></slot> `;
  }
}
