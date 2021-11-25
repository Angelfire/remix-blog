import fs from "fs/promises";
import invariant from "tiny-invariant";
import parseFrontMatter from "front-matter";
import path from "path";
import { marked } from "marked";

function isValidPostAttributes(attributes) {
  return attributes?.title;
}

const postsPath = path.join(__dirname, '../posts');

export async function getPosts() {
  const dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async filename => {
      const file = await fs.readFile(
        path.join(postsPath, filename)
      );

      const { attributes } = parseFrontMatter(
        file.toString()
      );

      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title
      };
    })
  );
}

export async function getPost(slug) {
  const filepath = path.join(postsPath, `${slug}.md`);
  const file = await fs.readFile(filepath);

  const { attributes, body } = parseFrontMatter(file.toString());
  const html = marked(body);

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  return { html, slug, title: attributes.title };
}

export async function createPost(post) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;

  await fs.writeFile(
    path.join(postsPath, `${post.slug}.md`),
    md
  );

  return getPost(post.slug);
}
