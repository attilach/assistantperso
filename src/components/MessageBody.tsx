"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBody({ children }: { children: string }) {
  return (
    <div className="markdown text-foreground text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
