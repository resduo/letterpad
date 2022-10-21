import { FC } from "react";

import { createId } from "@/shared/utils";

import {
  IconDown,
  IconFullWidth,
  IconSmallHeight,
  IconSplit,
  IconUp,
} from "./icons";
import { Block } from "../types";

interface Props {
  onChange: (change: Block) => void;
  item: Block;
  move: (dir: "up" | "down") => void;
  isPrevRowImageLeft: boolean;
  rowIndex: number;
}
export const LayoutToolbar: FC<Props> = ({
  onChange,
  item,
  move,
  isPrevRowImageLeft,
  rowIndex,
}) => {
  const onSmallHeight = () => {
    onChange({ ...item, cover: "banner" });
  };

  const onFullWidth = () => {
    const mergeItem: Block = { columns: 1, data: [], id: createId() };

    if (item.data[0].type === "image") {
      mergeItem.data = [
        {
          type: "image",
          image: item.data[0].image,
          text: item.data[0]?.text ?? item.data[1]?.text,
        },
      ];
    } else if (item.data[1].type === "image") {
      mergeItem.data = [
        {
          type: "image",
          image: item.data[1].image,
          text: item.data[1]?.text || item.data[0]?.text,
        },
      ];
    }
    onChange({ ...mergeItem, columns: 1 });
  };

  const onSplit = () => {
    let data = [...item.data];
    if (isPrevRowImageLeft) {
      data = [{ type: "text" }, { ...data[0], type: "image" }];
    } else {
      data = [{ ...data[0], type: "image" }, { type: "text" }];
    }

    onChange({
      data,
      columns: 2,
      id: createId(),
    });
  };
  const isNotFirstRow = rowIndex != 0;
  const isNotFirstAndSecondrow = rowIndex > 1;
  return (
    <div className="left-1/2  top-10 z-50 flex  justify-center rounded-t-lg  border  border-b-0 border-gray-200 bg-slate-100 p-2 shadow-sm dark:border-gray-800 dark:bg-gray-800">
      <button className="icon-class rounded-l-md" onClick={onSmallHeight}>
        <IconSmallHeight />
      </button>
      <button className="icon-class rounded-l-md" onClick={onFullWidth}>
        <IconFullWidth />
      </button>
      <button aria-current="page" className={"icon-class "} onClick={onSplit}>
        <IconSplit />
      </button>

      {isNotFirstAndSecondrow && (
        <button className="icon-class " onClick={() => move("up")}>
          <IconUp />
        </button>
      )}

      {isNotFirstRow && (
        <button
          className="icon-class rounded-r-md"
          onClick={() => move("down")}
        >
          <IconDown />
        </button>
      )}
    </div>
  );
};
