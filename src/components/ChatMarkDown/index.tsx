import ReactMarkdown from "react-markdown";
import remarkGfn from "remark-gfm";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { ContainerDirective } from "mdast-util-directive";
import rehypeSlug from "rehype-slug";
// import rehypeShiki from "@shikijs/rehype";
// import remarkBreaks from "remark-breaks";

function myRemarkContainer() {
  return (tree: Root) => {
    visit(tree, (node) => {
      // 匹配容器指令 containerDirective
      if (node.type === "containerDirective") {
        const containerNode = node as ContainerDirective;
        const name = containerNode.name;
        containerNode.data = {
          hName: "div",
          hProperties: {
            className: [
              `${name} bg-white rounded-2xl shadow-xl border border-gray-300 p-6`,
            ],
          },
        };
        // node.children = [
        //   {
        //     type: 'element',
        //     tagName: 'div',
        //     properties: {},
        //     children: node.children
        //   }
        // ]
      }
    });
  };
}

export const ChatMarkDown = ({
  content,
  languageType,
}: {
  content: string;
  languageType?: string;
}) => {
  return (
    <div
      className="markdown-body flex flex-col gap-4 [&_li_div]:indent-0 [&_blockquote_div]:indent-0"
      id="article-wrapper"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfn, remarkDirective, myRemarkContainer]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="my-1 leading-relaxed text-2xl font-bold" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="my-1 leading-relaxed text-xl font-bold scroll-m-26"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="my-1 leading-relaxed text-lg font-bold" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="my-1 leading-relaxed text-md font-bold" {...props}>
              {children}
            </h4>
          ),
          p: ({ children, node, ...props }) => {
            return (
              <div className={`my-1 leading-relaxed indent-8`} {...props}>
                {children}
              </div>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-1">{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-1">{children}</ol>
          ),

          code({ className, children }) {
            const isBlockCode = className?.startsWith("language-");
            const inline = !isBlockCode;
            if (inline) {
              return (
                <div className="bg-slate-300 dark:bg-slate-900 rounded-xl p-4 my-2">
                  <p className="text-sm opacity-50">{languageType}</p>
                  <hr className="mb-4 mt-2 opacity-50" />
                  <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-sm ">
                    {children}
                  </code>
                </div>
              );
            }
            return (
              <div className="bg-slate-300 dark:bg-slate-900 rounded-xl p-4 my-2">
                <p className="text-sm opacity-50">{languageType}</p>
                <hr className="mb-4 mt-2 opacity-50" />
                <pre className="bg-slate-900 text-gray-50 p-3 rounded my-2 overflow-auto text-sm">
                  <code className={className}>{children}</code>
                </pre>
              </div>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-auto my-2">
                <table className="border-collapse w-full">{children}</table>
              </div>
            );
          },
          th: ({ children }) => (
            <th className="border bg-gray-100 p-1">{children}</th>
          ),
          td: ({ children }) => <td className="border p-1">{children}</td>,
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-2 pl-4 border-l-4 border-sky-400 bg-sky-50 p-3 rounded-r-md text-slate-700"
              {...props}
            >
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4" />,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-teal-400"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <div className="my-2">
              <img src={src} alt={alt} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
