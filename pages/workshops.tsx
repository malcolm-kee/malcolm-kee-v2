import { PageContainer } from 'components/page-container';
import { Seo } from 'components/seo';
import Link from 'next/link';
import { workshopDetails } from '../config/workshop.const';

export default function Workshops() {
  return (
    <PageContainer>
      <Seo title="Workshops by Malcolm Kee" />
      <div className="px-4 sm:px-6 py-6">
        <main className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
              Workshops
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">
              Workshops that I've conducted.
            </p>
          </div>
          <div>
            <ul className="space-y-6">
              {Object.entries(workshopDetails).map(([slug, details]) => (
                <li className="text-center">
                  <Link href={slug} key={slug}>
                    <a className="text-lg sm:text-2xl hover:underline">
                      {details.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </PageContainer>
  );
}
