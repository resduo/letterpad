import { useState, createContext } from "react";
import {
  updatePostApi,
  updatePostDraftAttributes,
} from "@/components/post/api";
import usePost from "@/components/post/usePost";
import { InputUpdatePost } from "@/__generated__/__types__";
import { useContext } from "react";
import { Helpers } from "letterpad-editor";
import { PostContextType } from "@/components/post/types";

export const PostContext = createContext<Partial<PostContextType>>({});

export const PostProvider: React.FC = ({ children }) => {
  const [updating, setUpdating] = useState(false);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const { post, error, setPost } = usePost();
  const [helpers, setHelpers] = useState<Helpers>();

  const setPostAttribute = async (attrs: Omit<InputUpdatePost, "id">) => {
    if (post) {
      const newAttrs = updatePostDraftAttributes(attrs, post);
      setPost({ ...newAttrs });
      setUpdating(true);
      await updatePostApi(attrs, newAttrs.id);
      setUpdating(false);
    }
  };

  const onMediaBrowse = () => setFileExplorerOpen(true);

  const onFileExplorerClose = () => setFileExplorerOpen(false);

  const context: PostContextType = {
    updating,
    setUpdating,
    fileExplorerOpen,
    post,
    error,
    setPost,
    helpers,
    setHelpers,
    setPostAttribute,
    onMediaBrowse,
    onFileExplorerClose,
  };

  return (
    <PostContext.Provider value={context}>{children}</PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
