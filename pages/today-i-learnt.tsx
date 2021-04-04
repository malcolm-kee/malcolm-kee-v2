import { Seo } from 'components/seo';
import fs from 'fs';
import glob from 'glob';
import { prepareMdx } from 'lib/prepare-mdx';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';

interface Article {
  url: string;
  title: string;
}

interface ArticleCategory {
  title: string;
  articles: Array<Article>;
}

interface TodayILearntListingProps {
  categories: Array<ArticleCategory>;
}

function TodayILearntListing(props: TodayILearntListingProps) {
  return (
    <div className="px-4 sm:px-6 py-6">
      <Seo title="Today I Learnt - Malcolm Kee" />
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-3">Today I Learnt</h1>
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 py-3">
          {props.categories.map(({ title, articles }) => (
            <section key={title}>
              <h2 className="text-xl font-mono mb-2">{title}</h2>
              <ul className="space-y-3">
                {articles.map((article) => (
                  <li key={article.url}>
                    <Link href={article.url}>
                      <a className="hover:underline">{article.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

const tilPath = path.resolve(process.cwd(), 'til').split(path.sep).join('/');

export const getStaticProps: GetStaticProps<TodayILearntListingProps> = async function getStaticProps() {
  const mdxPaths = glob.sync(`${tilPath}/**/*.{md,mdx}`);
  const mdxResults = await Promise.all(
    mdxPaths.map((filePath) =>
      fs.promises.readFile(filePath, 'utf-8').then(prepareMdx)
    )
  );

  const articleMap = new Map<string, Array<Article>>();

  mdxResults.forEach(({ frontmatter: { topics, title } }, index) => {
    const url = `/today-i-learnt/${path.parse(mdxPaths[index]).name}`;

    const articleMetadata = {
      title,
      url,
    };

    (topics as Array<string>).forEach((topic) => {
      const currentArticles = articleMap.get(topic);

      if (currentArticles) {
        currentArticles.push(articleMetadata);
      } else {
        articleMap.set(topic, [articleMetadata]);
      }
    });
  });

  const categories: Array<ArticleCategory> = [];

  articleMap.forEach((articles, title) =>
    categories.push({
      title,
      articles,
    })
  );

  categories.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return {
    props: {
      categories,
    },
  };
};

export default TodayILearntListing;
