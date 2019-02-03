
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


function dijkstra(graph, startNode, endNode, debugFlag) {

  // track lowest cost to reach each node
  const trackedCosts = Object.assign({[endNode]: Infinity}, graph[startNode]);

  // track paths
  const trackedParents = {[endNode]: null};
  for (let child in graph[startNode]) {
    trackedParents[child] = startNode;
  }

  // track nodes that have already been processed
  const processedNodes = [];

  // Set initial node. Pick lowest cost node.
  let node = findLowestCostNode(trackedCosts, processedNodes);

  while (node) {

    let costToReachNode = trackedCosts[node];
    let childrenOfNode = graph[node];

    for (let child in childrenOfNode) {
      let costFromNodetoChild = childrenOfNode[child];
      let costToChild = costToReachNode + costFromNodetoChild;

      if (!trackedCosts[child] || trackedCosts[child] > costToChild) {
        trackedCosts[child] = costToChild;
        trackedParents[child] = node;
      }
    }

    processedNodes.push(node);

    node = findLowestCostNode(trackedCosts, processedNodes);
  }

  return processedNodes;
}

function findLowestCostNode(costs, processed){

  const knownNodes = Object.keys(costs);

  return knownNodes.reduce((lowest, node) => {
    if (lowest === null && !processed.includes(node)) {
      lowest = node;
    }
    if (costs[node] < costs[lowest] && !processed.includes(node)) {
      lowest = node;
    }
    return lowest;
  }, null);

}

