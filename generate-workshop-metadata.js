const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const frontmatter = require('@github-docs/frontmatter');

const asyncGlob = util.promisify(glob);

const workshopPath = path
  .resolve(process.cwd(), 'workshops')
  .split(path.sep)
  .join('/');

(async function generateWorkshopMetadata() {
  const markdownPaths = await asyncGlob(`${workshopPath}/**/*.mdx`);

  const mdDetails = await Promise.all(
    markdownPaths.map(async (mdPath) => {
      const relativePath = path.relative(workshopPath, mdPath);
      const workshop = relativePath.split('/')[0];
      const frontMatter = frontmatter(await fs.readFile(mdPath, 'utf-8')).data;

      return {
        frontMatter,
        path: mdPath,
        slug: path.parse(mdPath).name,
        workshop,
      };
    })
  );

  /**
   * @type {Record<string, Array<{frontMatter: {order: number; title: string; section: string}; path: string; slug: string; workshop: string;}>>}
   */
  const workshopLessons = {};

  mdDetails.forEach((details) => {
    if (workshopLessons[details.workshop]) {
      workshopLessons[details.workshop].push(details);
    } else {
      workshopLessons[details.workshop] = [details];
    }
  });

  Object.values(workshopLessons).forEach((lessons) =>
    lessons.sort((a, b) => {
      if (a.frontMatter.order > b.frontMatter.order) {
        return 1;
      }

      if (a.frontMatter.order < b.frontMatter.order) {
        return -1;
      }

      return 0;
    })
  );

  await fs.writeFile(
    './workshop-lesson.json',
    JSON.stringify(workshopLessons),
    'utf-8'
  );
})();
