import invariant from "tiny-invariant";
import { Form, redirect, useActionData, useTransition } from "remix";
import { createPost } from "~/post";

export const action = async ({ request }) => {
  await new Promise(res => setTimeout(res, 1000));

  const formData = await request.formData();
  let errors = {};

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ markdown, slug, title });

  return redirect("/admin");
}

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();

  return (
    <>
      <h2>New Post</h2>
      <Form method="post">
        <p>
          <label>
            Post Title:{" "}
            {errors?.title && <em>Title is required</em>}
            <input type="text" name="title" />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug && <em>Slug is required</em>}
            <input type="text" name="slug" />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">Markdown:</label>{" "}
          {errors?.markdown && <em>Markdown is required</em>}
          <br />
          <textarea name="markdown" />
        </p>
        <p>
          <button type="submit">
            {transition.submission
              ? "Creating..."
              : "Create Post"
            }
          </button>
        </p>
      </Form>
    </>
  );
}
