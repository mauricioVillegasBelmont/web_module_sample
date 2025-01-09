// CalculadoraChart;
import { LitElement, html, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import "@google-web-components/google-chart";

import { consume } from "@lit/context";
import userContext, {
  UserCalculatorData,
} from "context/UserContext/UserContext";
import { calculadora_form_config } from "components/CalculadoraForm/CalculadoraForm";
import { UserContextUpdatedEvent } from "components/UserContextProvider/UserContextProvider";

@customElement("calculadora-chart")
export class CalculadoraChart extends LitElement {
  constructor() {
    super();
    window.addEventListener("load", () => {
      this._sizeRender();
    });
    window.addEventListener("resize", () => {
      this._sizeRender();
    });
    window.addEventListener("contextUpdated", (e) => {
     this._contextUpdated(e)
    });
  }
  _contextUpdated(event: Event) {
    this._cache = (event as UserContextUpdatedEvent).detail;//(+new Date()).toString(32);
    this.requestUpdate();
  }
  @property({ attribute: false })
  chartWidth = 0;
  @property({ attribute: false })
  chartHeight = 0;
  @property({ attribute: false })
  _cache = (+new Date()).toString(32);

  _sizeRender() {
    const parent = this.parentElement;
    if (parent) {
      this.chartWidth = parent.getBoundingClientRect().width;
      this.chartHeight = parent.getBoundingClientRect().height;
      this.requestUpdate();
    }
  }

  @property({ attribute: false })
  styles = { maxWidth: "100%", height: "100%" };

  @property({ type: Number }) interest_rate = 0.15;
  @property()
  config: calculadora_form_config = {
    minInvest: 500,
    maxInvest: 20000,
    maxAge: 65,
    ageStep: 1,
  };

  @consume({ context: userContext, subscribe: true })
  contextValue?: UserCalculatorData;
  _investment(years: number) {
    return (
      years *
      12 *
      ((this.contextValue as UserCalculatorData)?.investment ??
        this.config.minInvest)
    );
  }
  get periods(): number[] {
    const years =
      this.config.maxAge -
      ((this.contextValue as UserCalculatorData)?.age ?? 18);

    if (years <= 6)  {
      return Array.from({ length: years }, (_, i) => i + 1);
    }
    // const step = Math.round(years / 6);
    const step = 6;
    const divisor = Math.round(years / step);
    // const length = Math.min(Math.round(years / divisor), 6);
    const length = 6;
    const result = Array.from({ length }, (_, i) => (i + 1) * divisor).filter(
      (x) => x <= years
    );

    return result;
  }

  _chartData() {
    const years = new Date().getFullYear();
    const periods = this.periods.map((p) => [
      (p + years).toString(),
      this._investment(p),
      this._investment(p) * this.interest_rate,
      "",
    ]);
    const config = [["Genre", "ahorrado", "intereses", { role: "annotation" }]];
    const dataArray = [...config, ...periods];
    return dataArray;
  }

  _chartOptions(chartHeight: number) {
    return {
      height: chartHeight,
      backgroundColor: "none",
      series: {
        0: { color: "#D71853" },
        1: { color: "#772D86" },
      },
      axes: {
        x: {
          distance: { label: "years" }, // Bottom x-axis.
          brightness: { side: "top", label: "apparent magnitude" }, // Top x-axis.
        },
        y: {
          gridlines: { color: "transparent", minSpacing: 0 },
          textPosition: "left",
        },
      },
      vAxis: {
        gridlines: { color: "transparent", minSpacing: 0 },
        textPosition: "left",
      },
      hAxis: {
        gridlines: { color: "transparent", minSpacing: 0 },
        textPosition: "none",
      },
      legend: { position: "none" },
      bar: { groupWidth: "20" },
      isStacked: true,
    };
  }

  chart = {
    type: "column",
    _values: this._chartData(),
    _options: this._chartOptions(this.chartHeight),
    set options(options: any) {
      this._options = options;
    },
    get options(): string {
      return JSON.stringify(this._options);
    },
    set values(values: any[]) {
      this._values = values;
    },
    get values(): string {
      return JSON.stringify(this._values);
    },
  };

  willUpdate(changedProperties: PropertyValues<this>) {
    changedProperties.has("_cache");
    if (changedProperties.has("_cache")) {
      this.chart.values = this._chartData();
    }
    if (changedProperties.has("chartHeight")) {
      this.chart.options = this._chartOptions(this.chartHeight);
    }
  }

  render() {
    return html`
      <google-chart
        type="column"
        options="${this.chart.options}"
        data="${this.chart.values}"
        style=${styleMap(this.styles)}
      ></google-chart>
    `;
  }
}