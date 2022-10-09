import classnames from "classnames";
import Image from "next/future/image";
import { FC, useState } from "react";

import FileExplorer from "@/components/file-explorer";
import { Button } from "@/components_v2/button";

import { useBuilderContext } from "../../context";
import { ContentToolbar } from "../../toolbar";
import { IconImage } from "../../toolbar/icons";
import MiniEditor from "../../toolbar/mini-editor";
import { BlockItem } from "../../types";
interface Props {
  item?: BlockItem;
  columns: number;
  rowIndex: number;
  colIndex: number;
}
export const Cell: FC<Props> = ({ item, columns, rowIndex, colIndex }) => {
  const { preview, updateCell } = useBuilderContext();
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const isEmptyBlock = item && Object.keys(item).length === 0;
  const [formats, setFormats] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);

  const isImage = item?.type === "image";

  const showImgBtnCenter = !item?.image?.src && isImage && !preview;

  return (
    <div
      className={classnames(
        "relative h-full justify-center items-center flex",
        {
          "w-full": columns === 1,
          "lg:w-1/2": columns === 2,
          "bg-slate-100 dark:bg-slate-700": !item?.image?.src && isImage,
        },
      )}
    >
      <div className="absolute bottom-10 left-0 w-full text-center">
        {!preview && (
          <ContentToolbar
            setEditorOpen={(visible) => {
              setFormats(
                "h1 h2 | alignleft aligncenter alignright | blockquote ",
              );
              setEditorOpen(visible);
            }}
            editorOpen={editorOpen}
            item={item}
            setFileExplorerOpen={setFileExplorerOpen}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />
        )}
      </div>
      {showImgBtnCenter && (
        <div className="absolute top-1/2 left-1/2 -ml-8 -mt-10">
          <Button
            onClick={() => setFileExplorerOpen(true)}
            type="light"
            className="p-4 rounded-full"
          >
            <IconImage size={24} color="#000" />
          </Button>
        </div>
      )}
      {editorOpen ? (
        <div className="absolute left-0 w-full text-center p-6 md:px-20 ">
          <MiniEditor
            onChange={(text) =>
              updateCell(
                {
                  text: encodeURIComponent(text),
                  type: item?.type ?? "text",
                },
                rowIndex,
                colIndex,
              )
            }
            formats={formats}
            text={decodeURIComponent(item?.text ?? "Write something...")}
          />
        </div>
      ) : (
        item?.text && (
          <div
            className={classnames("text-white absolute text-center p-6", {
              "shadow-lg bg-opacity-10 p-20 rounded-md bg-black/40":
                item.type === "image",
              "p-10": item.type === "text",
            })}
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(item.text),
            }}
          />
        )
      )}
      <div className="w-full h-full justify-center items-center flex">
        {item?.image?.src && (
          <Image
            src={item.image.src}
            width="0"
            height="0"
            sizes="100vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt={item.image.description}
          />
        )}
        {isEmptyBlock && !editorOpen && (
          <span className="opacity-60">Add a text or an image</span>
        )}
      </div>
      <FileExplorer
        multi={true}
        isVisible={!!fileExplorerOpen}
        handleCancel={() => setFileExplorerOpen(false)}
        onInsert={(image) => {
          setFileExplorerOpen(false);
          const { src, width, height, caption } = image[0];
          updateCell(
            {
              image: { src, width, height, description: caption },
              type: "image",
            },
            rowIndex,
            colIndex,
          );
        }}
      />
    </div>
  );
};
