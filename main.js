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

function createBubbleChart(data) {
  // Specify the dimensions of the chart.
  const width = 800;
  const height = 500;
  const margin = 1; // to avoid clipping the root circle stroke

  // Create a categorical color scale.
  const color = d3
    .scaleOrdinal()
    .domain(["JavaScript", "TypeScript", "Go", "Python", "React"])
    .range(["yellow", "darkblue", "lightblue", "purple", "blue"]);

  // Create the pack layout.
  const pack = d3
    .pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

  // Compute the hierarchy from the (flat) data; expose the values
  // for each node; lastly apply the pack layout.
  const root = pack(d3.hierarchy({ children: data }).sum((d) => d.stars));

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-margin, -margin, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
    .attr("text-anchor", "middle");

  // Append the SVG to the chart container
  const chartContainer = document.getElementById("chart-container");
  chartContainer.appendChild(svg.node());

  // Place each (leaf) node according to the layout’s x and y values.
  const node = svg
    .append("g")
    .selectAll()
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  // Add a title.
  node
    .append("title")
    .text(
      (d) =>
        `${d.data.repo_name}\nStars: ${d.data.stars}\nForks: ${d.data.forks}\nLanguage: ${d.data.language}`
    );

  // Add a filled circle.
  node
    .append("circle")
    .attr("fill-opacity", 0.7)
    .attr("fill", (d) => {
      // Use custom colors based on languages, if available
      return d.data.language ? color(d.data.language) : "white";
    })
    .attr("stroke", (d) => {
      // Use thick black borders for nodes with no language
      return d.data.language ? "none" : "black";
    })
    .attr("stroke-width", (d) => {
      // Set stroke width for nodes with no language
      return d.data.language ? 0 : 3;
    })
    .attr("r", (d) => d.r);

  // Add a label.
  const text = node.append("text").attr("clip-path", (d) => `circle(${d.r})`);

  // Add a tspan for each CamelCase-separated word.
  text
    .selectAll()
    .data((d) => d.data.repo_name.split(/(?=[A-Z][a-z])|\s+/g)) // Split repo_name for word wrapping
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
    .text((d) => d);

  // Add a tspan for the node’s stars.
  text
    .append("tspan")
    .attr("x", 0)
    .attr(
      "y",
      (d) =>
        `${d.data.repo_name.split(/(?=[A-Z][a-z])|\s+/g).length / 2 + 0.35}em`
    )
    .attr("fill-opacity", 0.7)
    .text((d) => `Stars: ${d.data.stars}`);
}

// Call the function to load and display the CSV data
loadCSV();
