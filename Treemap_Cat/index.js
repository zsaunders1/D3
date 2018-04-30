// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');
import {select} from 'd3-selection';
import {scaleOrdinal} from 'd3-scale';
import {csv} from 'd3-fetch';
import {treemap, treemapResquarify, hierarchy} from 'd3-hierarchy';
import {groupBy, recursiveGroupBy} from './utils';
import {schemePaired} from 'd3-scale-chromatic';

domReady(() => {
  csv('./data/aac_shelter_cat_outcome.csv').then(data => myVis(data));
});

// this data set has the following categories
// 'age', 'outcome_type', 'breed', 'name'
const GROUP_BY = ['outcome_type', 'breed', 'age', 'age'];
const COLOR_BY = GROUP_BY[GROUP_BY.length - 1];

function myVis(data) {
  // The posters will all be 24 inches by 36 inches
  // Your graphic can either be portrait or landscape, up to you
  // the important thing is to make sure the aspect ratio is correct.

  // landscape
  const height = 900;
  const width = 1300;

  // const height = 5000;
  // const width = 36 / 24 * height;

  const margin = {top: 10, left: 10, right: 10, bottom: 10};
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const svg = select('svg')
    .attr('height', `${height}`)
    .attr('width', `${width}`);

  const treemapEval = treemap()
    .tile(treemapResquarify)
    .size([plotWidth, plotHeight])
    .round(true)
    .paddingInner(1);

  const color = scaleOrdinal(schemePaired)
    .domain(groupBy(data, COLOR_BY));

  const formattedTree = {
    name: 'root',
    children: recursiveGroupBy(data, GROUP_BY)
  };

  const root = hierarchy(formattedTree)
    .eachBefore(function addIds(d) {
      d.data.id = `${(d.parent ? `${d.parent.data.id}.` : '')}${d.data.name}`;
    })
    .sum(d => d.size)
    .sort((a, b) => (b.height - a.height || b.value - a.value));
  treemapEval(root);

  const block = svg.selectAll('g')
      .data(root.leaves())
    .enter().append('g')
    .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

  block.append('rect')
    .attr('id', d => d.data.id)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => color(d.data.id));

  // PUT YOUR SELECT TYPE CODE HERE

  // console.log(groupBy(data, COLOR_BY));
}
