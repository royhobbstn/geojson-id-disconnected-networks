
// Not my original work!
// adapted from the example here: https://repl.it/@stella_sighs/dijkstramedium
// authors explanation: https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04

module.exports = dijkstra;

function dijkstra(graph, startNode, endNode) {

  // track lowest cost to reach each node
  const trackedCosts = Object.assign({[endNode]: Infinity}, graph[startNode]);

  // track nodes that have already been processed
  const processedNodes = {};

  // Set initial node. Pick lowest cost node.
  let node = findNextNode(trackedCosts, processedNodes);

  let iter = 0;

  while (node) {
    iter++;

    let costToReachNode = trackedCosts[node];
    let childrenOfNode = graph[node];

    for (let child in childrenOfNode) {
      let costFromNodetoChild = childrenOfNode[child];
      let costToChild = costToReachNode + costFromNodetoChild;

      if (!trackedCosts[child] || trackedCosts[child] > costToChild) {
        trackedCosts[child] = costToChild;
      }
    }

    processedNodes[node] = true;

    node = findNextNode(trackedCosts, processedNodes);
  }

  return Object.keys(processedNodes);
}

function findNextNode(costs, processed){
  const knownNodes = Object.keys(costs);

  for(let node of knownNodes) {
    if(!processed[node]) {
      return node;
    }
  }

  return null;
}