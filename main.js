import axios from "axios";
import * as d3 from "d3";

// Function to load and display the CSV data
async function loadCSV() {
  try {
    // Load the CSV file using D3.js
    const csvData = await d3.csv("/Data/github-ranking.csv");

    // Store the data in a variable accessible by other functions
    window.csvData = csvData;

    // Define selectedFilter here
    //let selectedFilter = defaultFilter;

    // Create the initial bubble chart with the default filter and count
    updateChart("stars", "10");
    const bubbleButton = document.getElementById("bubble-button");
    bubbleButton.disabled = true;
    const barButton = document.getElementById("bar-button");
    let chartType = 0;
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

    // Add event listeners for chart type buttons
    bubbleButton.addEventListener("click", () => {
      updateToggleButton();
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = document.getElementById("count-select").value;
      const selectedLanguage = document.getElementById("language-select").value;
      updateChart(selectedFilter, selectedCount, selectedLanguage, 0);
    });

    barButton.addEventListener("click", () => {
      updateToggleButton();
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = document.getElementById("count-select").value;
      const selectedLanguage = document.getElementById("language-select").value;
      updateChart(selectedFilter, selectedCount, selectedLanguage, 1);
    });

    function updateToggleButton() {
      //check if bubble button has active class

      if (chartType === 0) {
        chartType = 1;
        console.log("chart is changed to bar");
        bubbleButton.classList.remove("active");
        barButton.classList.add("active");

        bubbleButton.disabled = false;
        barButton.disabled = true;
      } else if (chartType === 1) {
        chartType = 0;
        console.log("chart is changed to bubble");
        barButton.classList.remove("active");
        bubbleButton.classList.add("active");

        bubbleButton.disabled = true;
        barButton.disabled = false;
      }
    }

    // Display the data in the console
    //console.log(csvData);
  } catch (error) {
    console.error("Error loading CSV:", error.message);
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

  // Get the top 10 items
  const top10Data = uniqueSortedData.slice(0, countNum);
  //console.log(top10Data);
  // Remove the previous chart SVG element
  d3.select("svg").remove();

  // Create the updated bubble chart with the selected filter
  //createBubbleChart(top10Data, filter);
  if (chartType === 0) {
    createBubbleChart(top10Data, filter);
  } else if (chartType === 1) {
    createBarChart(top10Data, filter);
  } else {
    createBubbleChart(top10Data, filter);
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
    .domain(["JavaScript", "TypeScript", "Go", "Python", "React"])
    .range(["yellow", "darkblue", "lightblue", "purple", "blue"]);

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
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
    .attr("text-anchor", "middle");

  // Append the SVG to the chart container
  const chartContainer = document.getElementById("chart-one-container");
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
    .attr("r", (d) => d.r)
    .style("cursor", "pointer") // Set cursor style to pointer

    // Add click event listener to open repo URL when clicked
    .on("click", (event, d) => {
      if (d.data.repo_url) {
        window.open(d.data.repo_url, "_blank");
      }
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

/**
 *
 * type-two
 * visualising github trending
 */

//function to get data from endpoint
async function fetchDataTwo(language, range) {
  console.log(`fetching ${language} and ${range}`);
  let url = `http://localhost:3000/api/get/trending?since=${range}&lang=${language}`;

  try {
    const response = await axios.get(url); // Await the Axios request
    if (response.status === 200) {
      return response.data; // Return the data
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return null; // Return null in case of an error
}

//actually load data into app
async function loadData() {
  let apiData;
  let isLoading = false;

  // Function to fetch data using other function to fetch data, LOL
  async function fetchDataAndUpdate(language, range) {
    isLoading = true;
    try {
      apiData = await fetchDataTwo(language, range);
      console.log(apiData);
      if (apiData !== null) {
        //Update chart or perform other operations with apiData here
        dataFetchSuccess();
        // Call the function to create the bar chart
        updateChartTwo(apiData);
      } else {
        dataFetchFail();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      dataFetchFail();
    } finally {
      isLoading = false; // Set loading to false when data is received or in case of an error
      updateUI();
    }
  }

  // Initial load with default values
  fetchDataAndUpdate(0, "daily");

  const langSelectTwo = document.getElementById("lang-select-two");
  const rangeSelectTwo = document.getElementById("range-select-two");
  const loadingIndicator = document.getElementById("loading-indicator"); // Assuming you have a loading indicator element
  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");

  function dataFetchSuccess() {
    // Data fetched successfully
    successMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }

  function dataFetchFail() {
    // Data fetch failed
    errorMessage.classList.remove("hidden");
    successMessage.classList.add("hidden");
  }

  function updateUI() {
    console.log("called fucnction", isLoading);
    isLoading
      ? ((loadingIndicator.style.display = "block"),
        successMessage.classList.add("hidden"),
        errorMessage.classList.add("hidden"))
      : (loadingIndicator.style.display = "none");
  }

  // Initial UI update
  updateUI();

  //get data from api when changes to filter are made
  langSelectTwo.addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    const selectedRange = document.getElementById("range-select-two").value;
    fetchDataAndUpdate(selectedLanguage, selectedRange);
    updateUI();
  });

  rangeSelectTwo.addEventListener("change", (event) => {
    const selectedRange = event.target.value;
    const selectedLanguage = document.getElementById("lang-select-two").value;
    fetchDataAndUpdate(selectedLanguage, selectedRange);
    updateUI();
  });
}
// Call the loadData function to load and display the data
loadData();
function createBarChartTwo(data) {
  // Specify chart dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create x and y scales
  const x = d3
    .scaleBand()
    .domain(data.map((d) => truncateText(d.name, 12))) // Truncate repository names
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => parseInt(d.stars.replace(",", "")))])
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
    .attr("x", (d) => x(truncateText(d.name, 12)))
    .attr("y", (d) => y(parseInt(d.stars.replace(",", ""))))
    .attr("width", x.bandwidth())
    .attr("height", (d) => innerHeight - y(parseInt(d.stars.replace(",", ""))))
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      if (d.link) {
        window.open(d.link, "_blank");
      }
    });

  // Add tooltips
  svg
    .selectAll(".bar")
    .append("title")
    .text((d) => `${d.name}\n${capitalizeFirstLetter("stars")}: ${d.stars}`);

  // Append the SVG to the chart container
  const chartContainer = document.getElementById("chart-two-container");
  chartContainer.appendChild(svg.node());
}

// Function to remove the existing chart
function removeChart() {
  const chartContainer = document.getElementById("chart-two-container");
  const oldChart = chartContainer.firstChild;
  if (oldChart) {
    oldChart.classList.add("fade-out"); // Add the fade-out class
    oldChart.addEventListener("transitionend", () => {
      chartContainer.removeChild(oldChart); // Remove the old chart when the transition ends
    });
  }
}

// Function to update the chart
function updateChartTwo(data) {
  removeChart(); // Remove the old chart
  createBarChartTwo(data); // Create and display the new chart
}
