import { displayChart } from "./chartSetup.js";
import {
  sortByKey,
  getCircuitBranches,
  mapCircuitBuses,
  prepareChartDataSets,
} from "./helper.js";

let availableCircuits = [];
let circuitSelect = document.querySelector("#select-circuit");
let circ2view = {};
let modelBuses = [];
let modelACCircuits = [];
let model2wtx = [];
let model3wtx = [];
let circuitBranches = [];
let relayingPointSelect = document.querySelector("#select-relay-point");
let circListGood = false;
let chartCanvas = document.querySelector("#chart");
let theChart = {};

/*
 * The following fetch calls "get" the network buses and AC line data.
 */

fetch(new Request("./ETYS DATA 2024 YEAR 2 Buses.json"))
  .then((response) => response.json())
  .then((data) => {
    modelBuses = data.filter(
      (dat) =>
        dat["Owner Name"] === "SHET" ||
        dat["Bus  Name"] === "BONB4-" ||
        dat["Bus  Name"] === "ZW052B" ||
        dat["Bus  Name"] === "DENN4-"
    );
    sortByKey(modelBuses, "Bus  Name");
  });

fetch(new Request("./ETYS DATA 2024 YEAR 2 AC Lines.json"))
  .then((response) => response.json())
  .then((data) => {
    modelACCircuits = data;
  });

fetch(new Request("./ETYS DATA 2024 YEAR 2 2 Winding Tx.json"))
  .then((response) => response.json())
  .then((data) => {
    model2wtx = data;
  });

fetch(new Request("./ETYS DATA 2024 YEAR 2 3 Winding Tx.json"))
  .then((response) => response.json())
  .then((data) => {
    model3wtx = data;
  });

fetch(new Request("./circuits.json"))
  .then((response) => response.json())
  .then((data) => {
    availableCircuits = data;
  });

/*
 * This is a worker event listener that populates the available circuits drop down list, on the first time of asking
 */
circuitSelect.addEventListener("focus", (event) => {
  if (!circListGood) {
    availableCircuits.forEach((circuit) => {
      circuitSelect.insertAdjacentHTML(
        "beforeend",
        `<option value=${circuit["id"]}>${circuit["id"]}</option>`
      );
    });
  }
  circListGood = true;
});

circuitSelect.addEventListener("change", (event) => {
  event.preventDefault();
  relayingPointSelect.innerHTML =
    "<option id='default' value=''>Please select</option>";

  circ2view = availableCircuits.filter(
    (circ) => circ["id"] === circuitSelect.value
  )[0];

  circ2view.sCircuitBuses.forEach((bus) => {
    relayingPointSelect.insertAdjacentHTML(
      "beforeend",
      `<option value=${bus["Bus  Name"]}>${bus["Bus  Name"]}</option>`
    );
  });

  circ2view.sCircuitBuses.filter((bus) => {
    return bus["Bus  Name"] === relayingPointSelect.value;
  })[0];
});

relayingPointSelect.addEventListener("change", (event) => {
  circuitBranches = getCircuitBranches(
    modelACCircuits,
    model2wtx,
    model3wtx,
    circ2view.sCircuitBuses
  );

  mapCircuitBuses(
    circ2view.sCircuitBuses,
    circ2view.sCircuitBuses.filter((bus) => {
      return bus["Bus  Name"] === relayingPointSelect.value;
    })[0],
    circuitBranches
  );

  theChart = displayChart(chartCanvas, prepareChartDataSets(circuitBranches));
});
