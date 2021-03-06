import { ZigBeeClient } from '../zigbee/zig-bee-client';
import { Callback, CharacteristicEventTypes, PlatformAccessory, Service } from 'homebridge';
import { ZigbeeNTHomebridgePlatform } from '../platform';
import { ServiceBuilder } from './service-builder';
import { DeviceState } from '../zigbee/types';

export class HumiditySensorServiceBuilder extends ServiceBuilder {
  constructor(
    platform: ZigbeeNTHomebridgePlatform,
    accessory: PlatformAccessory,
    client: ZigBeeClient,
    state: DeviceState
  ) {
    super(platform, accessory, client, state);
    this.service =
      this.accessory.getService(platform.Service.HumiditySensor) ||
      this.accessory.addService(platform.Service.HumiditySensor);
  }

  public withHumidity(): HumiditySensorServiceBuilder {
    const Characteristic = this.platform.Characteristic;

    this.service
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .on(CharacteristicEventTypes.GET, async (callback: Callback) => {
        callback(null, this.state.humidity);
      });

    return this;
  }

  public andBattery(): HumiditySensorServiceBuilder {
    const Characteristic = this.platform.Characteristic;

    this.service
      .getCharacteristic(Characteristic.StatusLowBattery)
      .on(CharacteristicEventTypes.GET, async (callback: Callback) => {
        callback(
          null,
          this.state.battery && this.state.battery <= 10
            ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
            : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL
        );
      });

    return this;
  }

  public build(): Service {
    return this.service;
  }
}
