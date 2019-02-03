const dijkstra = require('./dijkstra/algorithm');

module.exports = idAreas;

exports.idAreas = idAreas;

function idAreas(geo) {

  // make a copy
  const geo_copy = JSON.parse(JSON.stringify(geo));

  const features = geo_copy.features;

  const graph = {};
  const all_points = {};

  features.forEach(feature => {
    const first_pt = feature.geometry.coordinates[0].join(',');
    const last_pt = feature.geometry.coordinates[feature.geometry.coordinates.length - 1].join(',');

    if (!graph[first_pt]) {
      graph[first_pt] = {[last_pt]: 1};
    } else {
      graph[first_pt][last_pt] = 1;
    }

    if (!graph[last_pt]) {
      graph[last_pt] = {[first_pt]: 1};
    } else {
      graph[last_pt][first_pt] = 1;
    }

    all_points[first_pt] = '';
    all_points[last_pt] = '';
  });

  let network_iteration = 0;
  let keys = getKeys(all_points);

  const subnetworks = [];

  do {
    const traveled_nodes = dijkstra(graph, keys[0], keys[1]);

    subnetworks.push({name: network_iteration, size: traveled_nodes.length});

    traveled_nodes.forEach(node => {
      all_points[node] = network_iteration;
    });

    keys = getKeys(all_points);

    network_iteration++;

  } while (keys.length > 1);

  // 1 node leftover - edge case
  if(keys.length === 1) {
    all_points[keys[0]] = network_iteration;
    subnetworks.push({name: network_iteration, size: 1});
  }

  // order sub-networks by size
  subnetworks.sort((a,b) => {
    return b.size - a.size;
  });

  // create lookup subnetwork name to size value
  // size 1 is largest, smaller subnetworks follow in order
  const order_lookup = {};
  subnetworks.forEach((network, index) => {
    order_lookup[network.name] = index + 1;
  });

  // create lookup pt to subnetwork (size rank)
  const subnetwork_lookup = {};
  Object.keys(all_points).forEach(pt=> {
    subnetwork_lookup[pt] = order_lookup[all_points[pt]];
  });

  // add property to original geojson to add subnetwork size rank
  features.forEach(feature => {
    // only need on coordinate to determine subnetwork
    const coord = feature.geometry.coordinates[0].join(',');
    if(!feature.properties) {
      feature.properties = {};
    }
    feature.properties.subnetworkId = subnetwork_lookup[coord];
  });

  return geo_copy;
}



function getKeys(all_points) {
  return Object.keys(all_points).filter(key => {
    return all_points[key] === '';
  });
}


