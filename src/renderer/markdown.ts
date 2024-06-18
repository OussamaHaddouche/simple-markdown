
import { unified, Preset } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export const renderMarkdown = async (target: HTMLElement, markdown: string): Promise<void> => {
  const markdownToHtml = await toHTML(markdown);
  target.innerHTML = markdownToHtml
};

export const toHTML = async (markdown: string): Promise<string> => {
  const file = await unified()
    .use(remarkParse as Preset)
    .use(remarkGfm as Preset)
    .use(remarkRehype as Preset)
    .use(rehypeStringify as Preset)
    .process(markdown);

  return file.toString();
};