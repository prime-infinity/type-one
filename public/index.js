// Sample data for the bar chart
const data = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 15 },
  { label: "D", value: 25 },
  { label: "E", value: 12 },
];

// Set the dimensions and margins for the chart
const margin = { top: 30, right: 30, bottom: 70, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3
  .select(".chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create the x and y scales
const xScale = d3
  .scaleBand()
  .domain(data.map((d) => d.label))
  .range([0, width])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)])
  .range([height, 0]);

// Add the bars to the chart
svg
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d) => xScale(d.label))
  .attr("y", (d) => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => height - yScale(d.value));

// Add the x and y axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);

svg.append("g").attr("class", "y-axis").call(yAxis);
