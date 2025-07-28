import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

let myChart;

export const displayChart = (chartCanvas, dataPassed) => {
  const data = {
    datasets: dataPassed,
  };

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
            x: { min: -20, max: 100 },
            y: { min: -20, max: 100 },
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
          min: -Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 0.5),
          max: Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 1.5),
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
          min: -Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 0.5),
          max: Math.ceil(dataPassed[dataPassed.length - 1].data[1].y * 1.5),
          position: {
            x: 0,
          },
        },
      },
    },
  };

  try {
    if (myChart.canvas != undefined) {
      console.log("Hello");
      myChart.destroy();
    }
  } catch {
    console.log("There's no pre-existing chart - go build!");
  }

  myChart = new Chart(chartCanvas, config);
  console.log(myChart.canvas);
};
