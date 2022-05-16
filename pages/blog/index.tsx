import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  console.log(posts);
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="mt-5 mb-10 text-center text-lg font-semibold">
        Latest Posts:
      </h1>
      <ul>
        {posts.map((post, index) => (
          <div key={index} className="mb-5">
            <Link href={`/blog/${post.slug}`}>
              <a>
                <span className="text-lg text-red-500">{post.title}</span>
                <div>
                  <span>
                    {post.date} / {post.category}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export async function getStaticProps() {
  //nodeJS 부분
  // readdirSync: 데이터를 읽을 수 있게 해줌
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });

  // Blog Component의 prop로 감
  return {
    props: {
      posts: blogPosts,
    },
  };
}

export default Blog;
