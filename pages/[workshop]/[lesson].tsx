import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import cx from 'classnames';
import { CodeGlobalsContext } from 'components/code-globals';
import { CodeRenderer } from 'components/code-renderer';
import { IsInlineCodeContext, MdxRenderer } from 'components/mdx-renderer';
import { Seo } from 'components/seo';
import { WorkshopMenu } from 'components/workshop-menu';
import { workshopDetails } from 'config/workshop.const';
import fs from 'fs';
import { prepareMdx } from 'lib/prepare-mdx';
import { useScrollTopOnNavigate } from 'lib/use-scroll-top-on-navigate';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';
import * as React from 'react';
import workshopData from '../../workshop-lesson.json';
import styles from './lesson.module.css';

interface WorkshopLessonProps {
  mdx?: MdxResult;
  params?: Params;
  allLessons?: Array<LessonInfo>;
  nextLesson?: LessonInfo;
  prevLesson?: LessonInfo;
}

function WorkshopLesson({
  mdx,
  params,
  allLessons = [],
  prevLesson,
  nextLesson,
}: WorkshopLessonProps) {
  const scrollableEl = useScrollTopOnNavigate<HTMLDivElement>();

  if (!params) {
    return null;
  }

  const workshopInfo = workshopDetails[params.workshop];

  return (
    <div className="h-full flex flex-col">
      <header
        className={cx('px-4 sm:px-6 flex-shrink-0', workshopInfo.className)}
      >
        <div
          className={cx(
            'max-w-7xl mx-auto flex items-center justify-end',
            styles.header
          )}
        >
          <Link href="/">
            <a className="text-2xl md:text-3xl">{workshopInfo.name}</a>
          </Link>
        </div>
      </header>
      <div className="md:flex">
        <WorkshopMenu
          workshopName={workshopInfo.name}
          items={allLessons}
          className={styles.menu}
        />
        <div
          className={`md:flex-1 px-4 sm:px-6 pt-6 pb-16 md:pb-6 ${styles.wrapper}`}
          ref={scrollableEl}
        >
          {mdx && (
            <Seo title={`${mdx.frontmatter.title} - ${workshopInfo.name}`} />
          )}
          <main className="w-full overflow-x-hidden">
            {mdx && (
              <article
                className={`pb-12 relative prose max-w-full ${styles.article}`}
              >
                <h1>{mdx.frontmatter.title}</h1>
                <CodeGlobalsContext.Provider value={globals}>
                  <MdxRenderer
                    code={mdx.code}
                    components={injectedComponents}
                  />
                </CodeGlobalsContext.Provider>
              </article>
            )}
          </main>
          <nav className="flex justify-between items-center py-3 max-w-prose mx-auto">
            {prevLesson ? (
              <Link href={`/${prevLesson.workshop}/${prevLesson.slug}`}>
                <a className="inline-flex items-center space-x-2 text-2xl text-green-500 hover:underline">
                  <ChevronLeftIcon className="w-6 h-6" /> Prev
                </a>
              </Link>
            ) : (
              <span />
            )}
            {nextLesson ? (
              <Link href={`/${nextLesson.workshop}/${nextLesson.slug}`}>
                <a className="inline-flex items-center space-x-2 text-2xl text-green-500 hover:underline">
                  Next <ChevronRightIcon className="w-6 h-6" />
                </a>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
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

/**
 * Workaround while we have conflict between prettier format and mdx.
 */
const Details = (props: { children?: React.ReactNode; summary?: string }) => {
  return (
    <details>
      <summary>{props.summary}</summary>
      {props.children}
    </details>
  );
};

const noop = () => {};

function ajax(
  url: string,
  options?: {
    onSuccess?: (res: any) => void;
    method?: string;
    dataType?: string;
    onError?: (err: any) => void;
    body?: BodyInit;
  }
) {
  var opts = options || {};
  var onSuccess = opts.onSuccess || noop;
  var onError = opts.onError || noop;
  var dataType = opts.dataType || 'json';
  var method = opts.method || 'GET';

  var request = new XMLHttpRequest();
  request.open(method, url);
  if (dataType === 'json') {
    request.overrideMimeType('application/json');
    request.responseType = 'json';
    request.setRequestHeader('Accept', 'application/json');
  }

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      onSuccess(request.response);
    } else {
      onError(request.response);
    }
  };

  request.onerror = onError;

  request.send(opts.body);
}

const globals = {
  ajax,
};

function LessonCode(props: {
  children?: React.ReactNode;
  className?: string;
  highlightedLines?: string;
  live?: boolean;
}) {
  const isInlineCode = React.useContext(IsInlineCodeContext);

  if (!isInlineCode) {
    return (
      <CodeRenderer
        {...props}
        className={cx(props.className, styles.fullBleed)}
      />
    );
  }

  return <code {...props} />;
}

const injectedComponents = {
  Exercise,
  Details,
  pre: function Pre({ children }: { children?: React.ReactNode }) {
    const isCodeSnippet =
      React.Children.count(children) === 1 &&
      React.Children.toArray(children).every(
        (child) => React.isValidElement(child) && child.type === LessonCode
      );

    if (isCodeSnippet) {
      return (
        <>
          <IsInlineCodeContext.Provider value={false}>
            {children}
          </IsInlineCodeContext.Provider>
        </>
      );
    }

    return <pre>{children}</pre>;
  },
  code: LessonCode,
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
      const filePath = lessons[lessonIndex].path;

      const pathInfo = path.parse(filePath);

      const files = await fs.promises.readdir(pathInfo.dir);
      const jsFiles = files.filter((f) => /\.jsx?$/.test(f));

      const fileData: Record<string, string> = {};

      for (const jsFile of jsFiles) {
        const jsFileContent = await fs.promises.readFile(
          path.resolve(pathInfo.dir, jsFile),
          'utf-8'
        );
        fileData[`./${jsFile}`] = jsFileContent;
      }

      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const mdxResult = await prepareMdx(fileContent, { files: fileData });

      return {
        props: {
          mdx: mdxResult,
          params,
          allLessons: lessons,
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
