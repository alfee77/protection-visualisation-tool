export class MicomP443 {
  constructor(busNo, circuitId, relayConfiguration) {
    this.busNo = busNo;
    this.circuitId = circuitId;
    this.relayConfiguration = relayConfiguration[0];
    this.zonesDataArray = [];

    this.zone1Data = {};
    this.zone1Data.zoneName = "Zone 1 Ph";
    this.zone1Data.chartData = [];

    this.zone1Data.reachOhms =
      (this.relayConfiguration["Zone 1 Ph Reach"] / 100) *
      this.relayConfiguration["Line Impedance"];

    this.zone1Data.mhoCharacteristicCentreR =
      (this.zone1Data.reachOhms / 2) *
      Math.cos((Math.PI * this.relayConfiguration["Line Angle"]) / 180);
    this.zone1Data.mhoCharacteristicCentreX =
      (this.zone1Data.reachOhms / 2) *
      Math.sin((Math.PI * this.relayConfiguration["Line Angle"]) / 180);

    for (let i = 0; i <= 360; i++) {
      this.zone1Data.chartData.push({
        x:
          (this.zone1Data.reachOhms / 2) * Math.cos((Math.PI * i) / 180) +
          this.zone1Data.mhoCharacteristicCentreR,

        y:
          (this.zone1Data.reachOhms / 2) * Math.sin((Math.PI * i) / 180) +
          this.zone1Data.mhoCharacteristicCentreX,
      });
    }
    this.zonesDataArray.push(this.zone1Data);

    /**
     * Go configure Zone 2
     */
    this.zone2Data = {};
    this.zone2Data.zoneName = "Zone 2 Ph";
    this.zone2Data.chartData = [];

    this.zone2Data.reachOhms =
      (this.relayConfiguration["Zone 2 Ph Reach"] / 100) *
      this.relayConfiguration["Line Impedance"];

    this.zone2Data.mhoCharacteristicCentreR =
      (this.zone2Data.reachOhms / 2) *
      Math.cos((Math.PI * this.relayConfiguration["Line Angle"]) / 180);
    this.zone2Data.mhoCharacteristicCentreX =
      (this.zone2Data.reachOhms / 2) *
      Math.sin((Math.PI * this.relayConfiguration["Line Angle"]) / 180);

    for (let i = 0; i <= 360; i++) {
      this.zone2Data.chartData.push({
        x:
          (this.zone2Data.reachOhms / 2) * Math.cos((Math.PI * i) / 180) +
          this.zone2Data.mhoCharacteristicCentreR,

        y:
          (this.zone2Data.reachOhms / 2) * Math.sin((Math.PI * i) / 180) +
          this.zone2Data.mhoCharacteristicCentreX,
      });
    }

    this.zonesDataArray.push(this.zone2Data);
  }
}
