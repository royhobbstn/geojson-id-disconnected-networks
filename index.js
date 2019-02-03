
const dijkstra = require('./dijkstra/algorithm');

module.exports = idAreas;

exports.idAreas = idAreas;

function idAreas(geo) {

  // make a copy
  const features = JSON.parse(JSON.stringify(geo)).features;

  const graph = {};
  const all_points = {};

  features.forEach(feature => {
    const first_pt = feature.geometry.coordinates[0].join(',');
    const last_pt = feature.geometry.coordinates[feature.geometry.coordinates.length - 1].join(',');

    if(!graph[first_pt]) {
      graph[first_pt] = {[last_pt]: 1};
    } else {
      graph[first_pt][last_pt] = 1;
    }

    if(!graph[last_pt]) {
      graph[last_pt] = {[first_pt]: 1};
    } else {
      graph[last_pt][first_pt] = 1;
    }

    all_points[first_pt] = '';
    all_points[last_pt] = '';
  });

  const keys = Object.keys(all_points);

  console.log(keys.length);

  return dijkstra(graph, keys[0], keys[1]);
}




