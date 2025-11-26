import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

const Posts = React.lazy(() =>
  import("../components/Posts/PostsPage").then((m) => ({
    default: m.PostsPage,
  }))
);

const PostsPage = () => {
  return (
    <Provider store={store}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center p-6"><div className="text-muted-foreground">Loading...</div></div>}>
        <Posts />
      </Suspense>
    </Provider>
  );
};

export default PostsPage;
