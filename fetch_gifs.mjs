import https from 'https';

const queries = [
  { name: 'Synthwave', q: 'synthwave+sunset+loop' },
  { name: 'Pixel Night', q: 'pixel+art+city+night+rain' },
  { name: 'Lofi Study', q: 'anime+lofi+girl+study' },
  { name: 'Cyberpunk', q: 'cyberpunk+city+rain+loop' },
  { name: 'Deep Space', q: 'galaxy+stars+space+loop' },
  { name: 'Mystic Forest', q: 'magical+forest+nature+loop' },
  { name: 'Ocean Waves', q: 'ocean+waves+beach+aesthetic' },
  { name: 'Rainy Window', q: 'rain+window+city+aesthetic' },
  { name: 'Cozy Coffee', q: 'coffee+cafe+rain+aesthetic' },
  { name: 'Night Drift', q: 'initial+d+night+drive' },
  { name: 'Neon Abstract', q: 'neon+lights+abstract+loop' },
  { name: 'Vaporwave', q: 'vaporwave+statue+aesthetic' },
  { name: 'Pixel Campfire', q: 'pixel+art+campfire+night' },
  { name: 'Anime Scenery', q: 'makoto+shinkai+scenery' },
  { name: 'Retro Grid', q: 'outrun+grid+loop' },
  { name: 'Cherry Blossom', q: 'cherry+blossom+falling+aesthetic' }
];

async function fetchGif(query) {
  return new Promise((resolve) => {
    https.get(`https://g.tenor.com/v1/search?q=${query}&key=LIVDSRZULELA&limit=1`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.results && json.results.length > 0) {
          resolve(json.results[0].media[0].gif.url);
        } else {
          resolve('');
        }
      });
    });
  });
}

async function main() {
  const results = [];
  for (const item of queries) {
    const url = await fetchGif(item.q);
    results.push(`  { name: '${item.name}', url: '${url}' },`);
  }
  console.log(results.join('\n'));
}

main();
