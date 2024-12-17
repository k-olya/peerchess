// runs systems in _id order

import { EntityQuery } from "lib/ecs/entity-query";
import { EntitySortedArray } from "lib/ecs/entity-sorted-array";
import { BasicSystem, System } from "lib/ecs/system";

export class SystemGroup extends BasicSystem {
  _id: string;
  children: EntitySortedArray;
  constructor(_id: string, systems: System[]) {
    super(_id);
    this.children = new EntitySortedArray(systems);
    this._id = _id;
  }
  // a recursive function that prints the system tree
  print(indent: string = "") {
    console.log(`${indent}${this._id}`);
    for (const system of this.children) {
      if (system instanceof SystemGroup) {
        system.print(indent + "\t");
      } else {
        console.log(`${indent}\t${system._id}`);
      }
    }
  }
  onCreate() {}
  onUpdate() {}
  onRun(...args: any[]) {
    for (const system of this.children) {
      system.run(...args);
    }
  }
  onFree() {
    for (const system of this.children) {
      system.free();
    }
  }
}
