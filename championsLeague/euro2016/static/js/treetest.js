var closeNodes, diagonal, h, highlightOff, highlightOn, i, m, root, toggle, tree, update, vis, w;

m = [20, 120, 20, 120];

w = 1280 - m[1] - m[3];

h = 800 - m[0] - m[2];

i = 0;

root = null;

tree = d3.layout.tree().size([h, w]);

diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

vis = d3.select("#body").append("svg:svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

d3.json("{% static "js/flare.json" %}", function(json) {
  var toggleAll;
  root = json;
  root.x0 = h / 2;
  root.y0 = 0;
  toggleAll = function(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  };
  root.children.forEach(toggleAll);
  toggle(root.children[1]);
  toggle(root.children[1].children[2]);
  toggle(root.children[9]);
  toggle(root.children[9].children[0]);
  update(root);
});

update = function(source) {
  var duration, link, node, nodeEnter, nodeExit, nodeUpdate, nodes;
  duration = d3.event && d3.event.altKey ? 5000 : 500;
  nodes = tree.nodes(root).reverse();
  nodes.forEach(function(d) {
    return d.y = d.depth * 180;
  });
  node = vis.selectAll("g.node").data(nodes, function(d) {
    return d.id || (d.id = ++i);
  });
  nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("transform", function(d) {
    return "translate(" + source.y0 + "," + source.x0 + ")";
  }).on("click", function(d) {
    if (d3.event.metaKey) {
      highlightOn(d);
    } else {
      highlightOff(d);
      highlightOn(d);
    }
    toggle(d);
    update(d);
  });
  nodeEnter.append("svg:circle").attr("r", 1e-6).style("fill", function(d) {
    if (d._children) {
      return "lightsteelblue";
    } else {
      return "#fff";
    }
  });
  nodeEnter.append("svg:text").attr("x", function(d) {
    if (d.children || d._children) {
      return -10;
    } else {
      return 10;
    }
  }).attr("dy", ".35em").attr("text-anchor", function(d) {
    if (d.children || d._children) {
      return "end";
    } else {
      return "start";
    }
  }).text(function(d) {
    return d.name;
  }).style("fill-opacity", 1e-6);
  nodeUpdate = node.transition().duration(duration).attr("transform", function(d) {
    return "translate(" + d.y + "," + d.x + ")";
  });
  nodeUpdate.select("circle").attr("r", 4.5).style("fill", function(d) {
    if (d._children) {
      return "lightsteelblue";
    } else {
      return "#fff";
    }
  });
  nodeUpdate.select("text").style("fill-opacity", 1);
  nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
    return "translate(" + source.y + "," + source.x + ")";
  }).remove();
  nodeExit.select("circle").attr("r", 1e-6);
  nodeExit.select("text").style("fill-opacity", 1e-6);
  link = vis.selectAll("path.link").data(tree.links(nodes), function(d) {
    return d.target.id;
  });
  link.enter().insert("svg:path", "g").attr("class", function(d) {
    return "link source-" + d.source.name + " target-" + d.target.name;
  }).attr("d", function(d) {
    var o;
    o = {
      x: source.x0,
      y: source.y0
    };
    return diagonal({
      source: o,
      target: o
    });
  }).transition().duration(duration).attr("d", diagonal);
  link.transition().duration(duration).attr("d", diagonal);
  link.exit().transition().duration(duration).attr("d", function(d) {
    var o;
    o = {
      x: source.x,
      y: source.y
    };
    return diagonal({
      source: o,
      target: o
    });
  }).remove();
  return nodes.forEach(function(d) {
    d.x0 = d.x;
    return d.y0 = d.y;
  });
};

toggle = function(d) {
  if (d.children) {
    d._children = d.children;
    return d.children = null;
  } else {
    d.children = d._children;
    return d._children = null;
  }
};

closeNodes = function(root) {
  var d, _i, _len, _ref, _results;
  _ref = root.children;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    d = _ref[_i];
    if (d.children) {
      d.children = d._children;
      _results.push(d._children = null);
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

highlightOn = function(d) {
  var parentLine;
  parentLine = function(d) {
    if (d.parent) {
      parentLine(d.parent);
      vis.selectAll("path.link.source-" + d.parent.name + ".target-" + d.name).classed('highlight', true);
    }
  };
  parentLine(d);
  return update(d);
};

highlightOff = function(d) {
  vis.selectAll("path.link").classed('highlight', false);
  return update(d);
};
