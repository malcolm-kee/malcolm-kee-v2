import { MdxRenderer } from 'components/mdx-renderer';
import { Seo } from 'components/seo';
import Link from 'next/link';
import { PageContainer } from 'components/page-container';
import fs from 'fs';
import glob from 'glob';
import { prepareMdx } from 'lib/prepare-mdx';
import type { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import * as React from 'react';

interface TodayILearntProps {
  mdx?: MdxResult;
}

function TodayILearnt({ mdx }: TodayILearntProps) {
  return (
    <PageContainer>
      <div className="px-4 sm:px-6 py-6">
        {mdx && <Seo title={`TIL ${mdx.frontmatter.title} - Malcolm Kee`} />}
        <main>
          <article className="pb-12">
            <div className="prose max-w-prose mx-auto">
              {mdx && <h1>{mdx.frontmatter.title}</h1>}
              {mdx && <MdxRenderer code={mdx.code} />}
            </div>
          </article>
        </main>
        <nav className="max-w-prose mx-auto">
          <Link href="/today-i-learnt">
            <a className="text-2xl font-medium text-green-500 hover:underline">
              {'<'} All TIL
            </a>
          </Link>
        </nav>
      </div>
    </PageContainer>
  );
}

type MdxResult = {
  code: string;
  frontmatter: Record<string, any>;
};

type Params = {
  slug: string;
};

const tilPath = path.resolve(process.cwd(), 'til').split(path.sep).join('/');

export const getStaticProps: GetStaticProps<
  TodayILearntProps,
  Params
> = async function getStaticProps({ params }) {
  if (params) {
    const fileContent = await fs.promises.readFile(
      path.resolve(tilPath, `${params.slug}.mdx`),
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
  const results = glob.sync(`${tilPath}/**/*.{md,mdx}`);

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

export default TodayILearnt;
