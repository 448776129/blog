import Link from "next/link";
import type { FunctionComponent } from "react";

interface propsTypes {
  router: string;
}

/** 文章跳转的超链接标签*/
const ArticleLink: FunctionComponent<propsTypes> = props => {
  return (
    <>
      <style jsx>{`
        a {
          color: inherit;
        }
      `}</style>
      <Link href={`/article/${props.router}`}>
        <a>{props.children}</a>
      </Link>
    </>
  );
};
export default ArticleLink;
