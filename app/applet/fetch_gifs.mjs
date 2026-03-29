import https from 'https';

https.get('https://g.tenor.com/v1/search?q=aesthetic+landscape+gif&key=LIVDSRZULELA&limit=20', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    json.results.forEach(r => {
      console.log(r.media[0].gif.url);
    });
  });
});
