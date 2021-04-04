import { Seo } from 'components/seo';
import fs from 'fs';
import glob from 'glob';
import { prepareMdx } from 'lib/prepare-mdx';
import { getMDXComponent } from 'mdx-bundler/client';
import type { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import * as React from 'react';

interface TodayILearntProps {
  mdx?: MdxResult;
}

const components = {
  code: function Code({ children }: { children?: React.ReactNode }) {
    return <code className="language-text">{children}</code>;
  },
};

function TodayILearnt({ mdx }: TodayILearntProps) {
  const Component = React.useMemo(
    () => (mdx ? getMDXComponent(mdx.code) : null),
    [mdx]
  );

  return (
    <div className="px-4 sm:px-6 py-6">
      {mdx && <Seo title={`TIL ${mdx.frontmatter.title} - Malcolm Kee`} />}
      <article className="pb-12">
        <div className="prose max-w-prose mx-auto">
          {mdx && <h1>{mdx.frontmatter.title}</h1>}
          {Component && <Component components={components} />}
        </div>
      </article>
    </div>
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
