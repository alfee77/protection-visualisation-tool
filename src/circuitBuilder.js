import { displayChart } from "./chartSetup.js";
import {
  sortByKey,
  getCircuitBranches,
  mapCircuitBuses,
  prepareChartDataSets,
} from "./helper.js";

let modelBuses = [];
let modelBusSelect = document.querySelector("#select-bus");
let modelACCircuits = [];
let model2wtx = [];
let model3wtx = [];
let addBus = document.querySelector("#add-bus");
let circuitBuses = [];
let circuitBusesCards = document.querySelector("#bus-list");
let circuitBranches = [];
let circuitBranchesCards = document.querySelector("#branch-list");
let circuitId = document.querySelector("#circ-id");
let buildCircuitButton = document.querySelector("#build-circ");
let busListGood = false;
let chartCanvas = document.querySelector("#chart");
let savedCircuitBuses = [];
let saveCircuitBusesButton = document.querySelector("#save-circ");
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

/*
 * This is a worker event listener that populates the bus drop down list, on the first time of asking
 */
modelBusSelect.addEventListener("focus", (event) => {
  if (!busListGood) {
    modelBuses.forEach((bus) => {
      modelBusSelect.insertAdjacentHTML(
        "beforeend",
        `<option value=${bus["Bus  Name"]}>${bus["Bus  Name"]}</option>`
      );
    });
  }
  busListGood = true;
});

/*
 * This event listener "listens" to the Add Bus button, and adds the selected node to the
 * circuitBuses array, and the circuit buses table.
 */
addBus.addEventListener("click", (event) => {
  event.preventDefault();
  if (modelBusSelect.value != "") {
    circuitBuses.push(
      modelBuses.find((bus) => {
        return bus["Bus  Name"].includes(modelBusSelect.value);
      })
    );
  }

  circuitBusesCards.innerHTML = "";
  circuitBuses.forEach((bus) => {
    circuitBusesCards.insertAdjacentHTML(
      "beforeend",
      `<li class="card">
      <div>
        <h3 class="bName">${bus["Bus  Name"]}</h3>
        <div class="bNumber">Bus number: ${bus["Bus  Number"]}, Bus Voltage: ${bus["Base kV"]}kV</div>
      </div>
    </li>`
    );
  });
});

buildCircuitButton.addEventListener("click", (event) => {
  event.preventDefault();
  circuitBranches = getCircuitBranches(
    modelACCircuits,
    model2wtx,
    model3wtx,
    circuitBuses
  );
  mapCircuitBuses(circuitBuses, circuitBuses[0], circuitBranches);
  theChart = displayChart(chartCanvas, prepareChartDataSets(circuitBranches));
  circuitBranchesCards.innerHTML = "";
  let n = 1;
  circuitBranches.forEach((branch) => {
    circuitBranchesCards.insertAdjacentHTML(
      "beforeend",
      `<li class="card">
      <div>
        <h3 class="bName">Branch #${n}</h3>
        <div class="bNumber">From: ${branch["From Bus  Name"].substring(
          0,
          6
        )} <br />To  : ${branch["To Bus  Name"].substring(0, 6)}</div>
      </div>
    </li>`
    );
    n++;
  });
});

saveCircuitBusesButton.addEventListener("click", (event) => {
  event.preventDefault();
  savedCircuitBuses.push({
    id: circuitId.value,
    sCircuitBuses: circuitBuses,
  });
  console.log(savedCircuitBuses);
  circuitBuses = []; //reset the circuit buses
  document.querySelector("#create-form").reset(); //reset the form
  circuitBusesCards.innerHTML = "";
  circuitBranchesCards.innerHTML = "";
  theChart.destroy();
});
