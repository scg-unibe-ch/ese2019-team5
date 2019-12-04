import {ServiceUpdateType} from "./serviceUpdate.enum";

export class ServiceUpdate {
  private type: ServiceUpdateType;
  private newValue: string | number;

  constructor(type: ServiceUpdateType, newValue: string|number) {
    this.newValue = newValue;
    this.type = type;
  }

  public getNewValue(): string | number {
    return this.newValue;
  }

  public getUpdateType(): ServiceUpdateType {
    return this.type;
  }
}
