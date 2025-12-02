
import { crawlWebsite } from '../lib/siteCrawler';

async function testCrawl() {
  const url = 'https://helps2.com/';
  console.log(`Crawling ${url}...`);
  try {
    const data = await crawlWebsite(url);
    console.log('Crawl successful!');
    console.log('Title:', data.title);
    console.log('Description:', data.metaDescription);
    console.log('Word Count:', data.wordCount);
    console.log('H1 Tags:', data.h1Tags);
    console.log('Issues:', data.issues);
    console.log('Full Data Keys:', Object.keys(data));
  } catch (error) {
    console.error('Crawl failed:', error);
  }
}

testCrawl();
