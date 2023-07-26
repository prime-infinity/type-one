import * as d3 from "d3";

// Function to load and display the CSV data
async function loadCSV() {
  try {
    // Load the CSV file using D3.js
    const csvData = await d3.csv("/Data/github-ranking.csv");

    // Sort the data by stars in descending order
    csvData.sort((a, b) => b.stars - a.stars);

    // Get the top 10 items
    const top10Data = csvData.slice(0, 10);

    // Create the bar chart
    createBarChart(top10Data);

    // Display the data in the console
    //console.log(csvData);
  } catch (error) {
    console.error("Error loading CSV:", error.message);
  }
}

// Function to create the bar chart
function createBarChart(data) {
  // Set up the chart dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create the SVG container
  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create the x-scale for the stars
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.repo_name))
    .range([0, innerWidth])
    .padding(0.1);

  // Create the y-scale for the stars
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.stars)])
    .range([innerHeight, 0]);

  // Create the x-axis
  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em");

  // Create the y-axis
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

  // Create the bars
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.repo_name))
    .attr("y", (d) => yScale(d.stars))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => innerHeight - yScale(d.stars))
    .attr("fill", "steelblue");
}

// Call the function to load and display the CSV data
loadCSV();
