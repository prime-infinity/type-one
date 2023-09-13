import axios from "axios";
import * as d3 from "d3";

const scrappingData = [
  {
    name: "pengzhile /      cocopilot",
    description: "你可以把它称为：联合副驾驶。",
    programmingLanguage: "Shell",
    stars: "3,332",
    forks: "502",
    starsToday: "929",
  },
  {
    name: "KillianLucas /      open-interpreter",
    description: "OpenAI's Code Interpreter in your terminal, running locally",
    programmingLanguage: "Python",
    stars: "11,884",
    forks: "839",
    starsToday: "511",
  },
  {
    name: "baichuan-inc /      Baichuan2",
    description:
      "A series of large language models developed by Baichuan Intelligent Technology",
    programmingLanguage: "Python",
    stars: "769",
    forks: "30",
    starsToday: "151",
  },
  {
    name: "tjy-gitnub /      win12",
    description: "Windows 12 网页版，在线体验 点击下面的链接在线体验",
    programmingLanguage: "HTML",
    stars: "2,926",
    forks: "321",
    starsToday: "549",
  },
  {
    name: "modularml /      mojo",
    description: "The Mojo Programming Language",
    programmingLanguage: "",
    stars: "10,046",
    forks: "628",
    starsToday: "350",
  },
  {
    name: "Pythagora-io /      gpt-pilot",
    description:
      "Dev tool that writes scalable apps from scratch while the developer oversees the implementation",
    programmingLanguage: "Python",
    stars: "2,922",
    forks: "229",
    starsToday: "359",
  },
  {
    name: "XPixelGroup /      DiffBIR",
    description: "",
    programmingLanguage: "Python",
    stars: "645",
    forks: "26",
    starsToday: "327",
  },
  {
    name: "run-llama /      sec-insights",
    description: "A real world full-stack application using LlamaIndex",
    programmingLanguage: "TypeScript",
    stars: "783",
    forks: "104",
    starsToday: "189",
  },
  {
    name: "omerbt /      TokenFlow",
    description:
      'Official Pytorch Implementation for "TokenFlow: Consistent Diffusion Features for Consistent Video Editing" presenting "TokenFlow"',
    programmingLanguage: "Python",
    stars: "904",
    forks: "51",
    starsToday: "73",
  },
  {
    name: "aripiprazole /      rinha-de-compiler",
    description: "🥖 | Rinha de compiladores (ou interpretadores kkkk",
    programmingLanguage: "Rust",
    stars: "356",
    forks: "53",
    starsToday: "120",
  },
  {
    name: "aigc-apps /      sd-webui-EasyPhoto",
    description: "📷 EasyPhoto | Your Smart AI Photo Generator.",
    programmingLanguage: "Python",
    stars: "821",
    forks: "57",
    starsToday: "243",
  },
  {
    name: "labuladong /      fucking-algorithm",
    description:
      "刷算法全靠套路，认准 labuladong 就够了！English version supported! Crack LeetCode, not only how, but also why.",
    programmingLanguage: "Markdown",
    stars: "118,424",
    forks: "22,664",
    starsToday: "186",
  },
  {
    name: "leandromoreira /      linux-network-performance-parameters",
    description:
      "Learn where some of the network sysctl variables fit into the Linux/Kernel network flow. Translations: 🇷🇺",
    programmingLanguage: "",
    stars: "4,643",
    forks: "445",
    starsToday: "164",
  },
  {
    name: "ptahdao /      lmr-partners",
    description: "",
    programmingLanguage: "Solidity",
    stars: "363",
    forks: "99",
    starsToday: "86",
  },
  {
    name: "oven-sh /      bun",
    description:
      "Incredibly fast JavaScript runtime, bundler, test runner, and package manager – all in one",
    programmingLanguage: "Zig",
    stars: "44,010",
    forks: "1,245",
    starsToday: "52",
  },
  {
    name: "SimplifyJobs /      New-Grad-Positions",
    description:
      "A collection of New Grad full time roles in SWE, Quant, and PM.",
    programmingLanguage: "",
    stars: "7,320",
    forks: "892",
    starsToday: "94",
  },
  {
    name: "jzhang38 /      TinyLlama",
    description:
      "The TinyLlama project is an open endeavor to pretrain a 1.1B Llama model on 3 trillion tokens.",
    programmingLanguage: "Python",
    stars: "1,896",
    forks: "76",
    starsToday: "372",
  },
  {
    name: "jqlang /      jq",
    description: "Command-line JSON processor",
    programmingLanguage: "C",
    stars: "26,189",
    forks: "1,478",
    starsToday: "133",
  },
  {
    name: "opentffoundation /      opentf",
    description:
      "OpenTF lets you declaratively manage your cloud infrastructure.",
    programmingLanguage: "Go",
    stars: "4,851",
    forks: "116",
    starsToday: "836",
  },
  {
    name: "jpmorganchase /      python-training",
    description: "Python training for business analysts and traders",
    programmingLanguage: "Jupyter Notebook",
    stars: "3,180",
    forks: "769",
    starsToday: "24",
  },
  {
    name: "microsoft /      promptflow",
    description:
      "Build high-quality LLM apps - from prototyping, testing to production deployment and monitoring.",
    programmingLanguage: "Python",
    stars: "427",
    forks: "44",
    starsToday: "39",
  },
  {
    name: "grpc /      grpc-go",
    description: "The Go language implementation of gRPC. HTTP/2 based RPC",
    programmingLanguage: "Go",
    stars: "18,711",
    forks: "4,109",
    starsToday: "8",
  },
  {
    name: "cloudcommunity /      Free-Certifications",
    description: "A curated list of free courses & certifications.",
    programmingLanguage: "",
    stars: "4,911",
    forks: "594",
    starsToday: "312",
  },
  {
    name: "mui /      material-ui",
    description:
      "MUI Core: Ready-to-use foundational React components, free forever. It includes Material UI, which implements Google's Material Design.",
    programmingLanguage: "TypeScript",
    stars: "88,529",
    forks: "30,156",
    starsToday: "25",
  },
  {
    name: "mshumer /      gpt-author",
    description: "",
    programmingLanguage: "Jupyter Notebook",
    stars: "1,276",
    forks: "168",
    starsToday: "113",
  },
];

// Function to load and display the CSV data
async function loadCSV() {
  try {
    // Load the CSV file using D3.js
    const csvData = await d3.csv("/Data/github-ranking.csv");

    // Store the data in a variable accessible by other functions
    window.csvData = csvData;

    // Default filter option (stars)
    const defaultFilter = "stars";
    // Default count option (10)
    const defaultCount = "10";

    // Define selectedFilter here
    //let selectedFilter = defaultFilter;

    // Create the initial bubble chart with the default filter and count
    updateChart(defaultFilter, defaultCount);

    // Listen for changes in the filter selection
    const filterSelect = document.getElementById("filter-select");
    filterSelect.addEventListener("change", (event) => {
      console.log("changed", event.target.value);
      const selectedFilter = event.target.value;
      const countSelect = document.getElementById("count-select");
      countSelect.value = "10"; // Set the default count to 10 whenever the filter is changed
      const langSelect = document.getElementById("language-select");
      langSelect.value = "";
      bubbleButton.classList.add("active");
      barButton.classList.remove("active");
      updateChart(selectedFilter, 10);
    });

    // Listen for changes in the count selection
    const countSelect = document.getElementById("count-select");
    countSelect.addEventListener("change", (event) => {
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = event.target.value;
      const langSelect = document.getElementById("language-select");
      langSelect.value = "";
      bubbleButton.classList.add("active");
      barButton.classList.remove("active");
      updateChart(selectedFilter, selectedCount);
    });

    // Listen for changes in the language selection
    const languageSelect = document.getElementById("language-select");
    languageSelect.addEventListener("change", (event) => {
      console.log("changed", event.target.value);
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = document.getElementById("count-select").value;
      const selectedLanguage = event.target.value;
      bubbleButton.classList.add("active");
      barButton.classList.remove("active");
      updateChart(selectedFilter, selectedCount, selectedLanguage);
    });

    const bubbleButton = document.getElementById("bubble-button");
    const barButton = document.getElementById("bar-button");

    // Add event listeners for chart type buttons
    bubbleButton.addEventListener("click", () => {
      bubbleButton.classList.add("active");
      barButton.classList.remove("active");
      disableToggleButton(bubbleButton);
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = document.getElementById("count-select").value;
      const selectedLanguage = document.getElementById("language-select").value;
      updateChart(selectedFilter, selectedCount, selectedLanguage, "bubble");
    });

    barButton.addEventListener("click", () => {
      barButton.classList.add("active");
      bubbleButton.classList.remove("active");
      disableToggleButton(bubbleButton);
      const selectedFilter = document.getElementById("filter-select").value;
      const selectedCount = document.getElementById("count-select").value;
      const selectedLanguage = document.getElementById("language-select").value;
      updateChart(selectedFilter, selectedCount, selectedLanguage, "bar");
    });

    function disableToggleButton(button) {
      //check if bubble button has active class
      if (button.classList.contains("active")) {
        button.disabled = true;
        barButton.removeAttribute("disabled");
      } else {
        barButton.disabled = true;
        button.removeAttribute("disabled");
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
  if (chartType === "bubble") {
    createBubbleChart(top10Data, filter);
  } else if (chartType === "bar") {
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

// Function to filter data based on language and range
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
function filterData(data, language, range) {
  // Implement your data filtering logic here
  // For now, return the data as-is
  return data;
}

async function loadData() {
  const language = 0; // Default language
  const range = "daily"; // Default range
  let apiData;
  try {
    apiData = await fetchDataTwo(language, range);
    console.log(apiData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const langSelectTwo = document.getElementById("lang-select-two");
  langSelectTwo.addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    const selectedRange = document.getElementById("range-select-two").value;
    console.log(selectedLanguage, selectedRange);
  });

  const rangeSelectTwo = document.getElementById("range-select-two");
  rangeSelectTwo.addEventListener("change", (event) => {
    const selectedRange = event.target.value;
    const selectedLanguage = document.getElementById("lang-select-two").value;
    console.log(selectedLanguage, selectedRange);
  });

  //const chartType = "bubble"; // Default chart type (bubble)

  // Filter the data based on the provided language and range
  //const filteredData = filterData(apiData, language, range);
  //console.log(filteredData);
  // Update the chart based on the chart type
  //updateChartTwo(filteredData, chartType);
}
// Call the loadData function to load and display the data
loadData();

/*function updateChartTwo(data, chartType) {
  if (chartType === "bubble") {
    createBubbleChartTwo(data);
  } else if (chartType === "bar") {
    createBarChartTwo(data);
  } else {
    createBubbleChartTwo(data);
  }
}

function createBarChartTwo(data) {
  // Create a bar chart using the provided data
  // Implement your bar chart creation logic here
  console.log("Creating a bar chart with the following data:");
  console.log(data);
}

function createBubbleChartTwo(data) {
  // Create a bubble chart using the provided data
  // Implement your bubble chart creation logic here
  console.log("Creating a bubble chart with the following data:");
  console.log(data);
}*/
