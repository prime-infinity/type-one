import * as d3 from "d3";

// Function to load and display the CSV data
async function loadCSV() {
  try {
    // Load the CSV file using D3.js
    const csvData = await d3.csv("/Data/github-ranking.csv");

    // Create a Set to keep track of repository names
    const repositorySet = new Set();

    // Filter the data to include only unique repositories and sort by stars in descending order
    const uniqueSortedData = csvData
      .filter((d) => {
        if (!repositorySet.has(d.repo_name)) {
          repositorySet.add(d.repo_name);
          return true;
        }
        return false;
      })
      .sort((a, b) => b.stars - a.stars);

    // Get the top 10 items
    const top10Data = uniqueSortedData.slice(0, 10);

    // Create the bar chart
    //createBarChart(top10Data);
    createBubbleChart(top10Data);
    console.log(top10Data);

    // Display the data in the console
    //console.log(csvData);
  } catch (error) {
    console.error("Error loading CSV:", error.message);
  }
}

// Function to create the bubble chart
function createBubbleChart(data) {
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

  svg
    .on("mouseover", () => {
      console.log("SVG mouseover");
    })
    .on("click", () => {
      console.log("SVG click");
    });

  // Create the pack layout
  const pack = d3.pack().size([innerWidth, innerHeight]).padding(5);

  // Generate the hierarchy data for the pack layout
  const root = d3.hierarchy({ children: data }).sum((d) => d.stars);

  // Compute the pack layout
  pack(root);

  // Create the bubble elements
  const bubbles = svg
    .selectAll("circle")
    .data(root.leaves())
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", "red");

  bubbles.on("mouseover", (event, d) => {
    console.log(22);
  });
  bubbles.on("mouseout", handleMouseOut);
  bubbles.on("click", (event, d) => {
    console.log(222);
  });

  // Create the foreignObject elements inside the bubbles for labels
  const labels = svg
    .selectAll("foreignObject")
    .data(root.leaves())
    .enter()
    .append("foreignObject")
    .attr("x", (d) => d.x - d.r)
    .attr("y", (d) => d.y - d.r)
    .attr("width", (d) => 2 * d.r)
    .attr("height", (d) => 2 * d.r)
    .append("xhtml:div") // Use div as the embedded HTML element
    .style("display", "flex")
    .style("align-items", "center")
    .style("justify-content", "center")
    .style("width", (d) => 2 * d.r + "px")
    .style("height", (d) => 2 * d.r + "px")
    .style("font-size", "12px") // Set the font size for the labels
    .text((d) => d.data.repo_name); // Display the full text

  // Truncate the text if needed using CSS ellipsis
  labels
    .style("overflow", "hidden")
    .style("text-overflow", "ellipsis")
    .style("white-space", "nowrap");
}

// Function to handle mouseover event and show the tooltip
function handleMouseOver(event, d) {
  console.log(3);
  const tooltip = d3.select(".tooltip");

  // Calculate the tooltip position relative to the container
  const tooltipX = event.pageX + 10;
  const tooltipY = event.pageY + 10;

  // Update the tooltip content
  tooltip.html(
    `
    <strong>Repo Name:</strong> ${d.data.repo_name}<br>
    <strong>Stars:</strong> ${d.data.stars}<br>
    <strong>Forks:</strong> ${d.data.forks}<br>
    <strong>Language:</strong> ${d.data.language}<br>
    <strong>Issues:</strong> ${d.data.issues}<br>
    <strong>Last Commit:</strong> ${d.data.last_commit}<br>
    <strong>Description:</strong> ${d.data.description}
    `
  );

  // Show the tooltip
  tooltip
    .style("left", `${tooltipX}px`)
    .style("top", `${tooltipY}px`)
    .style("opacity", 0.9);
}

// Function to handle mouseout event and hide the tooltip
function handleMouseOut() {
  // Hide the tooltip
  d3.select(".tooltip").style("opacity", 0);
}

// Call the function to load and display the CSV data
loadCSV();
