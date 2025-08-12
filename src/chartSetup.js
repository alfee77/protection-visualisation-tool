import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

let myChart;
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
  console.log(maxAxisValue);

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
            x: { min: -20, max: 50 },
            y: { min: -20, max: 50 },
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
          // min: -Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 0.5),
          // max: Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 1.5),
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
          // min: -Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 0.5),
          // max: Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 1.5),
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
