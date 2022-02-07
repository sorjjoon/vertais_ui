import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface Post {
  HTMLContent: string;
  slug: string;
  meta: Meta;
}
export interface Meta {
  category: string;
  title: string;
  order: number;
  categoryOrder?: number;
  [key: string]: string | undefined | number;
}
const postsDirectory = path.join(process.cwd(), "posts");

export async function readSlug(slug: string): Promise<Post> {
  return new Promise<Post>((resolve, reject) => {
    fs.readFile(path.join(postsDirectory, slug), "utf8", (error, fileContent) => {
      if (error) {
        reject(error);
      } else {
        const { data: meta, content: mdContent } = matter(fileContent) as ReturnType<typeof matter> & { data: Meta };
        markdownToHTML(mdContent).then((HTMLContent) => {
          resolve({ meta, HTMLContent, slug: slug.replace(/\.md$/, "") });
        });
      }
    });
  });
}

export async function readAllSlugs() {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(postsDirectory, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

export default async function markdownToHTML(contentMd: string) {
  const result = await remark().use(html, { sanitize: false }).process(contentMd);
  return result.toString();
}
