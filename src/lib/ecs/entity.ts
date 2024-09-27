export interface Entity {
  // id is guaranteed to exist and be a string
  _id: string;
  // components
  [key: string]: any;
}

// iterate over components of an entity
export function forEachComponent(
  entity: Entity,
  callback: (key: string, value: any) => void
) {
  for (const [key, value] of Object.entries(entity)) {
    if (key === "_id") continue;
    callback(key, value);
  }
}
