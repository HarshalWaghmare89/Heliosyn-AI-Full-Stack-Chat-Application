import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

export const remarkPlugins = [remarkGfm, remarkMath];

export const rehypePlugins = [rehypeRaw, rehypeKatex];
