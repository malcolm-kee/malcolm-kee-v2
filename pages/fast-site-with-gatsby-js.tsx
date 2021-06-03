import { PageContainer } from 'components/page-container';
import { Seo } from 'components/seo';
import Link from 'next/link';

export default function FastSiteWithGatsbyJs() {
  return (
    <PageContainer>
      <Seo title="JavaScript: The React Parts" />
      <div className="h-full bg-black flex items-center justify-center">
        <div className="text-center max-w-7xl mx-auto pb-16">
          <h1 className="text-5xl xl:text-7xl leading-snug font-bold text-white mb-16">
            Fast Site with <span className="text-purple-600">Gatsby JS</span>
          </h1>
          <div>
            <Link href="/fast-site-with-gatsby-js/introduction">
              <a className="inline-block px-6 py-2 text-3xl xl:text-4xl bg-purple-400 text-black rounded">
                Start
              </a>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
