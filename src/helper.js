/**
 * @param {*} array
 * @param {*} key
 * @returns
 *
 * This little function takes an array and sorts it by a key. Thanks to David Brainer answer on StackOverflow
 */
export const sortByKey = (array, key) => {
  return array.sort(function (a, b) {
    let x = a[key];
    let y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
};

/**
 * Takes the entire model branches (including AC circuits, 2 winding and 3 winding transformers), the selected circuit buses, and creates and returns
 * an array of circuit branches.
 *
 * @param {*} pModelACCircuits
 * @param {*} pModel2wtx
 * @param {*} pModel3wtx
 * @param {*} pCircuitBuses
 * @returns circuitBranches
 */
export const getCircuitBranches = (
  pModelACCircuits,
  pModel2wtx,
  pModel3wtx,
  pCircuitBuses
) => {
  let possibleBranches = [];
  let circuitBranches = [];

  //Loop through the passed circuit buses, and extract all AC Circuits that contain said circuit bus. Store these branches in possibleBranches[]:
  pCircuitBuses.forEach((bus) => {
    possibleBranches = [
      ...possibleBranches,
      ...pModelACCircuits.filter((branch) => {
        return (
          branch["From Bus  Name"].includes(bus["Bus  Name"]) ||
          branch["To Bus  Name"].includes(bus["Bus  Name"])
        );
      }),
    ];
  });

  //Loop through the passed circuit buses, and extract all 2 winding transformers that contain said circuit bus. Store these branches in possibleBranches[]:
  pCircuitBuses.forEach((bus) => {
    possibleBranches = [
      ...possibleBranches,
      ...pModel2wtx.filter((tx) => {
        return (
          tx["From Bus  Name"].includes(bus["Bus  Name"]) ||
          tx["To Bus  Name"].includes(bus["Bus  Name"])
        );
      }),
    ];
  });

  //Loop through the passed circuit buses, and extract all 3 winding transformers that contain said circuit bus. Store these branches in possibleBranches[]:
  pCircuitBuses.forEach((bus) => {
    possibleBranches = [
      ...possibleBranches,
      ...pModel3wtx.filter((tx) => {
        return (
          tx["From Bus  Name"].includes(bus["Bus  Name"]) ||
          tx["To Bus  Name"].includes(bus["Bus  Name"])
        );
      }),
    ];
  });

  /*
   * The forgoing loop will return duplicate branches. By creating a Set object out of possibleBranches[]; this will remove, duplicates.
   * Then convert Set object back to array, and store it in place using the spread operator
   */
  let s = new Set(possibleBranches);
  possibleBranches = [...s];

  /*
   * This next bit of code loops through entries in possibleBranches[] and then establishes whether BOTH buses in the branch are contained in the
   * circuitBuses array; this condition must be TRUE for the possibleBranch to be a valid circuitBranch. If it is, it is added to circuitBranches[].
   * Ergo, circuitBranches[] is an array of the circuit branches in the identified circuit.
   */
  possibleBranches.forEach((branch) => {
    let fromBusTrue = false;
    let toBusTrue = false;

    pCircuitBuses.forEach((bus) => {
      if (branch["From Bus  Name"].includes(bus["Bus  Name"])) {
        fromBusTrue = true;
      }
      if (branch["To Bus  Name"].includes(bus["Bus  Name"])) {
        toBusTrue = true;
      }
    });

    if (fromBusTrue && toBusTrue) {
      circuitBranches.push(branch);
    }
  });

  /* Establish x and y coordinates for all branches from the relaying point out */

  return circuitBranches;
};

/**
 * This function is used to map co-ordinates for circuit buses on the impedance plane. The origin is the user identified relay point (pRelayBus).
 * It achieves this by looping through circuit branches (pCircuitBranches), identifying To.. and From... buses, and mapping the buses (pCircuitBuses)
 * with co-ordinates based on R and jX data contained in the AC Circuits Data.
 *
 * @param {*} pCircuitBuses[]
 * @param {*} pRelayBus
 * @param {*} pCircuitBranches[]
 * @returns pCircuitBranches[]
 */
export const mapCircuitBuses = (pCircuitBuses, pRelayBus, pCircuitBranches) => {
  //set initial conditions
  pCircuitBuses.forEach((bus) => {
    bus.isMapped = false;
    bus.isRelayPoint = false;
    bus.busCoordinates = {};
  });

  //set relay point
  pCircuitBuses.forEach((bus) => {
    if (bus["Bus  Number"] === pRelayBus["Bus  Number"]) {
      bus.isRelayPoint = true;
      bus.busCoordinates = { x: 0, y: 0 };
      bus.isMapped = true;
    } else {
      bus.isRelayPoint = false;
    }
  });

  do {
    pCircuitBranches.forEach((branch) => {
      //loop through the circuit branches and map the circuit buses
      let fromBus =
        pCircuitBuses[
          //The code array.findIndex(func) finds the index of the array that contains the object identified by func
          pCircuitBuses.findIndex((bus) => {
            return bus["Bus  Number"] === branch["From Bus  Number"];
          })
        ];
      let toBus =
        pCircuitBuses[
          //The code array.findIndex(func) finds the index of the array that contains the object identified by func
          pCircuitBuses.findIndex((bus) => {
            return bus["Bus  Number"] === branch["To Bus  Number"];
          })
        ];

      if (fromBus.isMapped && !toBus.isMapped) {
        //Therefore make the "To Bus  Number" bus have the co-ordinates branch.R + jbranch.X
        toBus.busCoordinates = {
          x: fromBus.busCoordinates.x + branch["R (ohm)"],
          y: fromBus.busCoordinates.y + branch["X (ohm)"],
        };
        toBus.isMapped = true;
      } else if (toBus.isMapped && !fromBus.isMapped) {
        //Therefore make the "From Bus  Number" bus have the co-ordinates branch.R +jbranch.X
        fromBus.busCoordinates = {
          x: toBus.busCoordinates.x + branch["R (ohm)"],
          y: toBus.busCoordinates.y + branch["X (ohm)"],
        };
        fromBus.isMapped = true;
      }

      branch.chartData = [
        {
          x: fromBus.busCoordinates?.x,
          y: fromBus.busCoordinates?.y,
        },
        {
          x: toBus.busCoordinates?.x,
          y: toBus.busCoordinates?.y,
        },
      ];
    });

    console.log(
      pCircuitBuses
        .map((bus) => bus.isMapped)
        .some((mappedBus) => mappedBus === false)
    );
  } while (
    pCircuitBuses
      .map((bus) => bus.isMapped)
      .some((mappedBus) => mappedBus === false)
  );

  return pCircuitBuses;
};

/**
 * This function takes the array pCircuitBranches as an argument. This contains all the identified circuit branches, with the mapped nodes/branches.
 * The function then extracts the relevant chart data, and creates and returns an array of configuration objects (chartDataSets[]) that is then ultimately passed to
 * the displayChart() function.
 *
 * @param {*} pCircuitBranches[]
 * @returns chartDataSets[]
 */
export const prepareChartDataSets = (pCircuitBranches) => {
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

  return chartDataSets;
};
