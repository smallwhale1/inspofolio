import { uid } from "uid";

export type ListItemType = {
  _id: string;
} & Record<string, any>;

export class ListManager {
  // gets a unique id for a list item
  static getNewId = (): string => {
    return uid();
  };

  // not in use
  static getTemporaryId = (oldList: ListItemType[], offset?: number) => {
    const idOffset = offset ? offset : 0;
    const newId =
      oldList.length === 0
        ? offset === undefined
          ? "1"
          : (offset + 1).toString()
        : (parseInt(oldList[oldList.length - 1]._id) + 1 + idOffset).toString();
    return newId;
  };
}
