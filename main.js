/** main.js */
import * as d3 from "d3";

// Function to show/hide loading state
function setLoadingState(isLoading) {
  const loadingState = document.querySelector(".loading-state");
  const chartContainer = document.getElementById("chart-one-container");

  if (isLoading) {
    if (loadingState) {
      loadingState.style.display = "flex";
    }
  } else {
    if (loadingState) {
      loadingState.style.display = "none";
    }
  }
}

// Function to load and display the CSV data
async function loadCSV() {
  try {
    setLoadingState(true);

    // Load the CSV file using D3.js
    const csvData = await d3.csv("/Data/github-ranking.csv");

    // Store the data in a variable accessible by other functions
    window.csvData = csvData;

    // Create the initial bubble chart with the default filter and count
    updateChart("stars", "10");
    const bubbleButton = document.getElementById("bubble-button");
    bubbleButton.disabled = true;
    let chartType = 0;

    setLoadingState(false);

    // Listen for changes in the filter selection
    const filterSelect = document.getElementById("filter-select");
    filterSelect.addEventListener("change", (event) => {
      console.log("changed", event.target.value);
      const selectedFilter = event.target.value;
      const countSelect = document.getElementById("count-select");
      const langSelect = document.getElementById("language-select");
      updateChart(
        selectedFilter,
        countSelect.value,
        langSelect.value,
        chartType
      );
    });

    // Listen for changes in the count selection
    const countSelect = document.getElementById("count-select");
    countSelect.addEventListener("change", (event) => {
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = event.target.value;
      const langSelect = document.getElementById("language-select");
      updateChart(selectedFilter, selectedCount, langSelect.value, chartType);
    });

    // Listen for changes in the language selection
    const languageSelect = document.getElementById("language-select");
    languageSelect.addEventListener("change", (event) => {
      console.log("changed", event.target.value);
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = document.getElementById("count-select").value;
      const selectedLanguage = event.target.value;
      updateChart(selectedFilter, selectedCount, selectedLanguage, chartType);
    });

    // Display the data in the console
    //console.log(csvData);
  } catch (error) {
    console.error("Error loading CSV:", error.message);
    setLoadingState(false);

    // Show error message
    const chartContainer = document.getElementById("chart-one-container");
    chartContainer.innerHTML = `
      <div class="loading-state">
        <div class="loading-error">Failed to load data</div>
        <p>Please check if the CSV file is available and try again.</p>
      </div>
    `;
  }
}

// Function to update the bubble chart based on the selected filter
function updateChart(filter, count, language, chartType) {
  // Get the CSV data from the stored variable
  const csvData = window.csvData;

  // Convert count to a number
  const countNum = +count;
  //console.log(countNum);

  // Create a Set to keep track of repository names
  const repositorySet = new Set();

  // Filter the data based on the language (if selected)
  const filteredData = language
    ? csvData.filter((d) => d.language === language)
    : csvData;

  //console.log(filteredData);

  // Filter the data to include only unique repositories and sort by the selected filter in descending order
  const uniqueSortedData = filteredData
    .filter((d) => {
      if (!repositorySet.has(d.repo_name)) {
        repositorySet.add(d.repo_name);
        return true;
      }
      return false;
    })
    .sort((a, b) => b[filter] - a[filter]);

  // Get the top items
  const topData = uniqueSortedData.slice(0, countNum);
  //console.log(topData);

  // Remove the previous chart SVG element with smooth transition
  const existingSvg = d3.select("#chart-one-container svg");
  if (!existingSvg.empty()) {
    existingSvg.transition().duration(300).style("opacity", 0).remove();
  }

  // Create the updated bubble chart with the selected filter
  if (chartType === 0) {
    // Add a slight delay to ensure smooth transition
    setTimeout(() => {
      createBubbleChart(topData, filter);
    }, 300);
  } else if (chartType === 1) {
    setTimeout(() => {
      createBarChart(topData, filter);
    }, 300);
  } else {
    setTimeout(() => {
      createBubbleChart(topData, filter);
    }, 300);
  }
}

function createBubbleChart(data, filter) {
  // Specify the dimensions of the chart.
  const width = 800;
  const height = 500;
  const margin = 1; // to avoid clipping the root circle stroke

  // Create a categorical color scale.
  const color = d3
    .scaleOrdinal()
    .domain([
      "JavaScript",
      "TypeScript",
      "Go",
      "Python",
      "React",
      "Java",
      "C++",
      "C#",
      "PHP",
      "Ruby",
      "Swift",
      "Kotlin",
      "Rust",
      "Dart",
    ])
    .range([
      "#f59e0b", // JavaScript - amber
      "#3b82f6", // TypeScript - blue
      "#06b6d4", // Go - cyan
      "#10b981", // Python - green
      "#8b5cf6", // React - purple
      "#ef4444", // Java - red
      "#6366f1", // C++ - indigo
      "#d946ef", // C# - fuchsia
      "#84cc16", // PHP - lime
      "#ec4899", // Ruby - pink
      "#f97316", // Swift - orange
      "#14b8a6", // Kotlin - teal
      "#a855f7", // Rust - violet
      "#22d3ee", // Dart - light blue
    ]);

  // Create the pack layout.
  const pack = d3
    .pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

  // Compute the hierarchy from the (flat) data; expose the values
  // for each node; lastly apply the pack layout.
  const root = pack(
    d3
      .hierarchy({ children: data })
      .sum((d) => d[filter]) // Use the selected filter here
      .sort((a, b) => b[filter] - a[filter]) // Sort by the selected filter in descending order
  );

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-margin, -margin, width, height])
    .attr(
      "style",
      "max-width: 100%; height: auto; font: 12px 'Inter', sans-serif;"
    )
    .attr("text-anchor", "middle")
    .style("opacity", 0); // Start with opacity 0 for fade-in effect

  // Append the SVG to the chart container
  const chartContainer = document.getElementById("chart-one-container");
  chartContainer.appendChild(svg.node());

  // Animate the SVG fade-in
  svg.transition().duration(500).style("opacity", 1);

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
    .attr("fill-opacity", 0.8)
    .attr("fill", (d) => {
      // Use custom colors based on languages, if available
      return d.data.language ? color(d.data.language) : "#64748b";
    })
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 2)
    .attr("r", 0) // Start with radius 0 for animation
    .style("cursor", "pointer")
    .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))")

    // Animate the circles growing
    .transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .attr("r", (d) => d.r)

    // Add click event listener to open repo URL when clicked
    .on("end", function () {
      d3.select(this).on("click", (event, d) => {
        if (d.data.repo_url) {
          window.open(d.data.repo_url, "_blank");
        }
      });
    });

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

// Function to create a bar chart
function createBarChart(data, filter) {
  //console.log("creating bar chart", data, filter);
  // Specify chart dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create x and y scales
  const x = d3
    .scaleBand()
    .domain(data.map((d) => truncateText(d.repo_name, 12))) // Truncate repository names
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[filter])])
    .nice()
    .range([innerHeight, 0]);

  // Create SVG container
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create x and y axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Add x and y axes to SVG
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis);
  svg.append("g").attr("class", "y-axis").call(yAxis);

  // Create bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(truncateText(d.repo_name, 12)))
    .attr("y", (d) => y(d[filter]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => innerHeight - y(d[filter]))
    .style("cursor", "pointer") // Set cursor style to pointer

    // Add click event listener to open repo URL when clicked
    .on("click", (event, d) => {
      if (d.repo_url) {
        window.open(d.repo_url, "_blank");
      }
    });

  // Add tooltips
  svg
    .selectAll(".bar")
    .append("title")
    .text(
      (d) => `${d.repo_name}\n${capitalizeFirstLetter(filter)}: ${d[filter]}`
    );

  // Append the SVG to the chart container
  const chartContainer = document.getElementById("chart-one-container");
  chartContainer.appendChild(svg.node());
}

// Function to capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// Function to truncate text
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}
// Call the function to load and display the CSV data
loadCSV();
