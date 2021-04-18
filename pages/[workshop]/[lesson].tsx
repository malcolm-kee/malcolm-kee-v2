import { MdxRenderer } from 'components/mdx-renderer';
import cx from 'classnames';
import { Seo } from 'components/seo';
import fs from 'fs';
import { prepareMdx } from 'lib/prepare-mdx';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import workshopData from '../../workshop-lesson.json';
import { workshopDetails } from 'config/workshop.const';
import * as React from 'react';

interface WorkshopLessonProps {
  mdx?: MdxResult;
  params?: Params;
  nextLesson?: LessonInfo;
  prevLesson?: LessonInfo;
}

function WorkshopLesson({
  mdx,
  params,
  prevLesson,
  nextLesson,
}: WorkshopLessonProps) {
  if (!params) {
    return null;
  }

  const workshopInfo = workshopDetails[params.workshop];

  return (
    <div className="h-full flex flex-col">
      <header
        className={cx(
          'py-4 px-4 sm:px-6 flex-shrink-0',
          workshopInfo.className
        )}
      >
        <div className="max-w-7xl mx-auto text-right">
          <Link href="/">
            <a className="text-2xl md:text-3xl">{workshopInfo.name}</a>
          </Link>
        </div>
      </header>
      <div className="px-4 sm:px-6 py-6">
        {mdx && (
          <Seo title={`${mdx.frontmatter.title} - ${workshopInfo.name}`} />
        )}
        <main>
          {mdx && (
            <article className="pb-12">
              <div className="prose max-w-prose mx-auto">
                <h1>{mdx.frontmatter.title}</h1>
                <MdxRenderer code={mdx.code} components={injectedComponents} />
              </div>
            </article>
          )}
        </main>
        <nav className="flex justify-between items-center max-w-prose mx-auto">
          {prevLesson ? (
            <Link href={`/${prevLesson.workshop}/${prevLesson.slug}`}>
              <a className="text-2xl font-medium text-green-500 hover:underline">
                {'<'}
              </a>
            </Link>
          ) : (
            <span />
          )}
          {nextLesson ? (
            <Link href={`/${nextLesson.workshop}/${nextLesson.slug}`}>
              <a className="text-2xl font-medium text-green-500 hover:underline">
                {'>'}
              </a>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}

const Exercise = ({
  title,
  children,
}: {
  title?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <section className="border-t border-b border-gray-300 my-8 pb-8">
      {title && <h3 className="text-lg mb-2">{title}</h3>}
      {children}
    </section>
  );
};

const injectedComponents = {
  Exercise,
};

interface MdxResult {
  code: string;
  frontmatter: Record<string, any>;
}

type Params = {
  lesson: string;
  workshop: WorkshopName;
};

type WorkshopData = typeof workshopData;

type WorkshopName = keyof WorkshopData;
type LessonInfo = WorkshopData[WorkshopName][number];

export const getStaticProps: GetStaticProps<
  WorkshopLessonProps,
  Params
> = async function getStaticProps({ params }) {
  if (params) {
    const lessons = workshopData[params.workshop];

    const lessonIndex = lessons.findIndex(
      (lesson) => lesson.slug === params.lesson
    );

    if (lessonIndex > -1) {
      const fileContent = await fs.promises.readFile(
        lessons[lessonIndex].path,
        'utf-8'
      );
      const mdxResult = await prepareMdx(fileContent);

      return {
        props: {
          mdx: mdxResult,
          params,
          prevLesson: lessons[lessonIndex - 1] || null,
          nextLesson: lessons[lessonIndex + 1] || null,
        },
      };
    }
  }

  return {
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async function getStaticPaths() {
  const paths = Object.values(workshopData)
    .map((lessons) =>
      lessons.map((lesson) => ({
        params: {
          lesson: lesson.slug,
          workshop: lesson.workshop as WorkshopName,
        },
      }))
    )
    .flat(2);

  return {
    paths,
    fallback: false,
  };
};

export default WorkshopLesson;
