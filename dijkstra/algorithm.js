
// Not my original work!
// adapted from the example here: https://repl.it/@stella_sighs/dijkstramedium
// authors explanation: https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04

module.exports = dijkstra;

function dijkstra(graph, startNode, endNode) {

  // track lowest cost to reach each node
  const trackedCosts = Object.assign({[endNode]: Infinity}, graph[startNode]);

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