import { MdxRenderer } from 'components/mdx-renderer';
import { PageContainer } from 'components/page-container';
import { Seo } from 'components/seo';
import fs from 'fs';
import glob from 'glob';
import { prepareMdx } from 'lib/prepare-mdx';
import { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import Link from 'next/link';

interface BlogProps {
  mdx?: MdxResult;
}

function Blog({ mdx }: BlogProps) {
  return (
    <PageContainer>
      <div className="px-4 sm:px-6 py-6">
        {mdx && <Seo title={`${mdx.frontmatter.title} - Malcolm Kee`} />}
        <main>
          {mdx && (
            <article className="pb-12" lang={mdx.frontmatter.lang || 'en'}>
              <div className="prose max-w-prose mx-auto">
                <h1>{mdx.frontmatter.title}</h1>
                <MdxRenderer code={mdx.code} />
              </div>
            </article>
          )}
        </main>
        <nav className="max-w-prose mx-auto">
          <Link href="/blog">
            <a className="text-2xl font-medium text-green-500 hover:underline">
              {'<'} All Blogs
            </a>
          </Link>
        </nav>
      </div>
    </PageContainer>
  );
}

interface MdxResult {
  code: string;
  frontmatter: Record<string, any>;
}

type Params = {
  slug: string;
};

const blogPath = path.resolve(process.cwd(), 'blogs').split(path.sep).join('/');

export const getStaticProps: GetStaticProps<
  BlogProps,
  Params
> = async function getStaticProps({ params }) {
  if (params) {
    const fileContent = await fs.promises.readFile(
      path.resolve(blogPath, `${params.slug}.md`),
      'utf-8'
    );
    const mdxResult = await prepareMdx(fileContent);

    return {
      props: {
        mdx: mdxResult,
      },
    };
  }

  return {
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async function getStaticPaths() {
  const results = glob.sync(`${blogPath}/**/*.md`);

  return {
    paths: results.map((result) => {
      return {
        params: {
          slug: path.parse(result).name,
        },
      };
    }),
    fallback: false,
  };
};

export default Blog;
