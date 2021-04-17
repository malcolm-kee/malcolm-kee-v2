import { PageContainer } from 'components/page-container';
import { Seo } from 'components/seo';
import { useRouter } from 'next/router';
import fs from 'fs';
import glob from 'glob';
import { prepareMdx } from 'lib/prepare-mdx';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';

interface Blog {
  url: string;
  title: string;
  date: string;
  summary?: string;
  tags: Array<string>;
}

interface BlogListingProps {
  blogs: Array<Blog>;
}

function BlogListing(props: BlogListingProps) {
  const router = useRouter();

  const query = router.query;

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 py-6">
        <Seo title="Blog - Malcolm Kee" />
        <main className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
              Blogs
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">
              My thoughts on technologies, books, or just any random stuffs.
            </p>
          </div>

          {query.tag && (
            <div className="space-x-3">
              <span>
                Showing blogs with tag:{' '}
                <span className="font-medium">{query.tag}</span>
              </span>
              <button
                onClick={() =>
                  router.push(
                    {
                      query: {},
                    },
                    undefined,
                    { shallow: true }
                  )
                }
                type="button"
                className="px-1 font-bold text-green-500 bg-white focus-ring"
              >
                Show All
              </button>
            </div>
          )}

          <ul className="grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
            {props.blogs.map(({ title, url, tags, summary }) =>
              !query.tag ||
              (Array.isArray(tags) && tags.includes(query.tag as string)) ? (
                <li className="rounded-lg shadow-lg overflow-hidden" key={url}>
                  <div className="bg-white p-6 h-full flex flex-col">
                    <p className="text-sm leading-5 font-medium text-primary-600 space-x-1">
                      {tags &&
                        tags.map((tag) => (
                          <button
                            onClick={() =>
                              router.push(
                                {
                                  query: { tag },
                                },
                                undefined,
                                { shallow: true }
                              )
                            }
                            type="button"
                            className="px-1 focus-ring"
                            key={tag}
                          >
                            {tag}
                          </button>
                        ))}
                    </p>
                    <Link href={url}>
                      <a className="flex-1 flex flex-col focus-ring">
                        <div className="flex-1">
                          <h2 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
                            {title}
                          </h2>
                          <p className="mt-3 text-base leading-6 text-gray-500">
                            {summary}
                          </p>
                        </div>
                      </a>
                    </Link>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </main>
      </div>
    </PageContainer>
  );
}

const blogPath = path.resolve(process.cwd(), 'blogs').split(path.sep).join('/');

export const getStaticProps: GetStaticProps<BlogListingProps> = async function getStaticProps() {
  const mdxPaths = glob.sync(`${blogPath}/**/*.{md,mdx}`);
  const mdxResults = await Promise.all(
    mdxPaths.map((filePath) =>
      fs.promises.readFile(filePath, 'utf-8').then(prepareMdx)
    )
  );

  const blogs: Array<Blog> = [];

  mdxResults.forEach(
    ({ frontmatter: { title, summary = null, date, tags = [] } }, index) => {
      const pathInfo = path.parse(mdxPaths[index]);

      const url = `/blog/${pathInfo.name}`;

      blogs.push({
        url,
        title,
        summary,
        tags,
        date,
      });
    }
  );

  blogs.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }

    if (a.date > b.date) {
      return -1;
    }

    return 0;
  });

  return {
    props: {
      blogs,
    },
  };
};

export default BlogListing;
