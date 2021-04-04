import { Seo } from 'components/seo';

export default function Home() {
  return (
    <div>
      <Seo />
      <main>
        <div className="px-4 sm:px-6 pt-8 pb-12 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl text-center text-green-500 font-bold">
              Malcolm Kee
            </h1>
            <ul className="sm:flex sm:justify-center text-center text-xl lg:text-3xl space-y-6 sm:space-y-0 max-w-xl mx-auto">
              <li className="sm:px-3 lg:px-6 leading-normal">
                Software Engineer
              </li>
              <li className="sm:px-3 lg:px-6 leading-normal sm:border-l-2 sm:border-white">
                Teacher
              </li>
            </ul>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-12">
          <div className="prose lg:prose-xl prose-green max-w-prose mx-auto">
            <p>
              A software engineer making web applications functional and
              accessible.
            </p>
            <p>
              I help companies to build component libraries that provide good
              user experience and developer experience.
            </p>
            <p>
              In my spare time, I conduct workshops to teach others on React and
              occasionally general web development in the{' '}
              <a href="https://www.kl-react.com/">local meetup</a> that I
              co-organize.
            </p>
            <ul className="lg:flex lg:items-center lg:space-x-12">
              <li>
                <a href="https://github.com/malcolm-kee">GitHub</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/malcolmkee/">LinkedIn</a>
              </li>
              <li>
                <a href="https://twitter.com/Malcolm_Kee">Twitter</a>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <small>Copyright Malcolm Kee. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
