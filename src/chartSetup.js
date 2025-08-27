import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

let myChart;

/**
 * This function takes the array pCircuitBranches as an argument. This contains all the identified circuit branches, with the mapped nodes/branches.
 * The function then extracts the relevant chart data, and creates and returns an array of configuration objects (chartDataSets[]) that is then ultimately passed to
 * the displayChart() function.
 *
 * @param {*} pCircuitBranches[]
 * @returns chartDataSets[]
 */
export const prepareChartDataSets = (pCircuitBranches, protectionDevice) => {
  let chartDataSets = [];
  pCircuitBranches.forEach((branch) => {
    chartDataSets.push({
      label: `From ${branch["From Bus  Name"].substring(0, 6)} to ${branch[
        "To Bus  Name"
      ].substring(0, 6)}`,
      data: branch.chartData,
      pointRadius: 2,
      borderWidth: 1,
      fill: false,
      tension: 0.1,
    });
  });

  protectionDevice.zonesDataArray.forEach((zone) => {
    chartDataSets.push({
      label: `${zone.zoneName}`,
      data: zone.chartData,
      pointRadius: 0,
      borderWidth: 1,
      fill: false,
      tension: 0.1,
    });
  });

  return chartDataSets;
};

/**
 *
 * @param {*} chartCanvas
 * @param {*} dataPassed
 * @returns
 *
 * dataPassed is an array containing the dataset for presentation in the chart.
 */
export const displayChart = (chartCanvas, dataPassed) => {
  const data = {
    datasets: dataPassed,
  };

  //this wee bit of code unpicks the dataPassed to parse a maximum axis value
  const arrayOfMaxImps = [];
  dataPassed.forEach((branch) => {
    branch.data.forEach((end) => arrayOfMaxImps.push(end["y"]));
  });
  let maxAxisValue = Math.max(...arrayOfMaxImps);

  //config block
  const config = {
    type: "scatter",
    data: data,
    options: {
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
          },
          limits: {
            x: {
              min: -Math.ceil(maxAxisValue * 0.3),
              max: Math.ceil(maxAxisValue * 1.1),
            },
            y: {
              min: -Math.ceil(maxAxisValue * 0.3),
              max: Math.ceil(maxAxisValue * 1.1),
            },
          },
          pan: {
            enabled: true,
            modifierKet: `xy`,
            scaleMde: `xy`,
          },
        },
        legend: {
          position: "top",
        },
      },

      showLine: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Resistance (R)",
            align: "center",
          },
          beginAtZero: true,
          min: -Math.ceil(maxAxisValue * 0.3),
          max: Math.ceil(maxAxisValue * 1.1),
          position: {
            y: 0,
          },
        },
        y: {
          title: {
            display: true,
            text: "Reactance (jX)",
            align: "center",
          },
          beginAtZero: true,
          min: -Math.ceil(maxAxisValue * 0.3),
          max: Math.ceil(maxAxisValue * 1.1),
          position: {
            x: 0,
          },
        },
      },
    },
  };

  try {
    if (myChart.canvas != undefined) {
      myChart.destroy();
    }
  } catch {}

  myChart = new Chart(chartCanvas, config);
  return myChart;
};
