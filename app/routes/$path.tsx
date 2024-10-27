import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getNoteData, NoteResponse } from "~/lib/api";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const data: NoteResponse = await getNoteData(params.path as string);
    return json(data);
  } catch (error) {
    console.error("Error fetching note:", error);
    throw new Response("Failed to load note", { status: 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Error" }];
  }

  const { title, path } = data.note;
  return [
    { charset: "utf-8" },
    { title },
    { property: "og:title", content: title },
    { property: "og:type", content: "article" },
    { property: "og:image", content: `https://embed.collectednotes.com/api?title=${encodeURIComponent(title)}&summary=` },
  ];
};

export default function NotePage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-3xl pt-12 sm:px-4 px-6">
      <div className="relative">
        <Link to="/" className="absolute top-0 left-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
            <path d="M0 0h48v48h-48z" fill="none"></path>
            <path d="M40 22h-24.34l11.17-11.17-2.83-2.83-16 16 16 16 2.83-2.83-11.17-11.17h24.34v-4z" fill="currentColor"></path>
          </svg>
        </Link>
        <div className="note prose lg:prose-xl pt-24 pb-16">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{
              h1: ({...props}) => <h1 className="text-4xl font-bold mb-4" {...props} />,
              h2: ({...props}) => <h2 className="text-3xl font-bold mt-8 mb-4" {...props} />,
              h3: ({...props}) => <h3 className="text-2xl font-bold mt-6 mb-3" {...props} />,
              p: ({...props}) => <p className="mb-4" {...props} />,
              ul: ({...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
              ol: ({...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
              li: ({...props}) => <li className="mb-2" {...props} />,
              pre: ({...props}) => (
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-md overflow-x-auto p-4" {...props} />
              ),
              code({className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                )
              },
              table: ({...props}) => (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                </div>
              ),
              thead: ({...props}) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
              th: ({...props}) => (
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" 
                  {...props} 
                />
              ),
              td: ({...props}) => (
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300" 
                  {...props} 
                />
              ),
            }}
          >
            {data.note.body}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
