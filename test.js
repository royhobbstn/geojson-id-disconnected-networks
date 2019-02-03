
const fs = require('fs').promises;
const idAreas = require('./index.js');

main();

async function main() {

  const geojson_raw = await fs.readFile('./full_network.geojson');
  const geojson = JSON.parse(geojson_raw);

  const updated_network = idAreas(geojson);

  await fs.writeFile('./done_network.geojson', JSON.stringify(updated_network), 'utf8');

}