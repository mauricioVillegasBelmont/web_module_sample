// CalculadoraChart;
import { LitElement, html, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import "@google-web-components/google-chart";

import CalculadoraMixin from "mixins/CalculadoraMixin/CalculadoraMixin";

import { consume } from "@lit/context";
import userContext, {
  UserCalculatorData,
} from "context/UserContext/UserContext";
import { UserContextUpdatedEvent } from "context/UserContext/UserContextProvider";
import configContext, {
  CalculatorConfigData,
} from "context/ConfigContext/ConfigContext";


@customElement("calculadora-chart")
export class CalculadoraChart extends CalculadoraMixin(LitElement) {
  constructor() {
    super();
    window.addEventListener("load", () => {
      this._sizeRender();
    });
    window.addEventListener("resize", () => {
      this._sizeRender();
    });
    window.addEventListener("contextUpdated", (e) => {
      this._contextUpdated(e);
    });
  }
  _contextUpdated(event: Event) {
    this._cache = (event as UserContextUpdatedEvent).detail; //(+new Date()).toString(32);
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
      this.chartWidth = parent.getBoundingClientRect().width * 0.8;
      this.chartHeight = parent.getBoundingClientRect().height;
      this.requestUpdate();
    }
  }

  @property({ attribute: false })
  styles = { maxWidth: "100%", height: "100%" };

  @consume({ context: userContext, subscribe: true })
  contextValue: UserCalculatorData = {
    age: 18,
    investment: 1000,
  };

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


  get yearlyInvestment() {
    return (
      12 *
      ((this.contextValue as UserCalculatorData).investment ??
        this.configValue.minInvest)
    );
  }
  get yearsLeft(): number {
    return (
      this.configValue.maxAge -
      ((this.contextValue as UserCalculatorData)?.age ?? 18)
    );
  }
  get vMax(): number {
    const years = this.configValue.maxAge - 17;
    const interestRate = Number(this.configValue.interestRate);
    const vMax = years * this.configValue.maxInvest * 12 * (interestRate + 1);
    return Math.round(vMax);
  }
  get periods(): number[] {
    const years = this.yearsLeft;
    if (years <= 6) {
      return Array.from({ length: years }, (_, i) => i + 1);
    }
    const step = 6;
    const divisor = Math.round(years / step);
    const length = 6;
    const result = Array.from({ length }, (_, i) => (i + 1) * divisor).filter(
      (x) => x <= years
    );

    return result;
  }

  _chartData() {
    const years = new Date().getFullYear();
    // const periods = this.periods.map((years) => {
    //   const invertido = this.inversionAcumulada({
    //     pay: this.contextValue.investment,
    //     years: years,
    //   });
    //   const crecimiento =
    //     this.tabulador({
    //       pay: this.contextValue.investment,
    //       years: this.contextValue.age - this.configValue.minAge,
    //     }) - invertido;
    //     // this.ROI({
    //     //   pay: this.contextValue.investment,
    //     //   rate: this.configValue.interestRate,
    //     //   years: years,
    //     // }) - invertido;
    //     // console.log(years+this.contextValue.age - this.configValue.minAge);

    //   return [`+${years} años`, invertido, crecimiento, ""];
    // });

    // console.log("periods", periods);
    // const periods = ()=>{
    // };
    console.log({
      pay: this.contextValue.investment,
      years: this.yearsLeft,
    });
    const invertido = this.inversionAcumulada({
      pay: this.contextValue.investment,
      years: this.yearsLeft,
    });
    const crecimiento =
      this.tabulador({
        pay: this.contextValue.investment,
        years: this.contextValue.age - this.configValue.minAge,
      }) - invertido;
    const periods = [`65 años`, invertido, crecimiento, ""];
    const config = [
      ["Genre", "Invertido", "Intereses", { role: "annotation" }],
    ];
    const dataArray = [...config, ...[periods]];
    return dataArray;
  }

  _chartOptions(chartWidth: number, chartHeight: number) {
    return {
      width: chartWidth,
      height: chartHeight,
      backgroundColor: "none",
      series: {
        0: { color: "#D71853" },
        1: { color: "#772D86" },
      },
      vAxis: {
        format: "currency",
        gridlines: { color: "rgba(255,255,255,.5)" },
        textPosition: "right",
        textStyle: { color: "#FFF" },
        baselineColor: "#fff",
      },
      hAxis: {
        baselineColor: "#fff",
        gridlines: { color: "transparent", minSpacing: 0 },
        // textPosition: "none",
        textStyle: { color: "#FFF" },
      },
      legend: { position: "none" },
      bar: { groupWidth: "20" },
      isStacked: true,
    };
  }

  chart = {
    type: "column",
    _values: this._chartData(),
    _options: this._chartOptions(this.chartWidth, this.chartHeight),
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
      this.chart.options = this._chartOptions(
        this.chartWidth,
        this.chartHeight
      );
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