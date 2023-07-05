import { ListItemType } from "./interfaces";
import { uid } from "uid";

export class ListManager {
  static getNewId = (oldList: ListItemType[], offset?: number): string => {
    return uid();
    // const idOffset = offset ? offset : 0;
    // const newId =
    //   oldList.length === 0
    //     ? offset === undefined
    //       ? "1"
    //       : (offset + 1).toString()
    //     : (parseInt(oldList[oldList.length - 1]._id) + 1 + idOffset).toString();
    // return newId;
  };
}
