// URL to fetch the JSON data
const dataURL = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to build the bar chart
function buildBarChart(sample) {
  d3.json(dataURL).then((data) => {
    const samples = data.samples;
    const result = samples.find(sampleObj => sampleObj.id === sample);

    if (!result) {
      console.error("Sample not found!");
      return;
    }

    // Extract top 10 OTUs
    const otu_ids = result.otu_ids.slice(0, 10).reverse();
    const sample_values = result.sample_values.slice(0, 10).reverse();
    const otu_labels = result.otu_labels.slice(0, 10).reverse();

    // Define the trace for the bar chart
    const barData = [{
      x: sample_values,
      y: otu_ids.map(id => `OTU ${id}`),
      text: otu_labels,
      type: "bar",
      orientation: "h"
    }];

    // Define layout
    const barLayout = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" },
      margin: { l: 100, r: 50, t: 50, b: 50 }
    };

    // Plot the bar chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to build the bubble chart
function buildBubbleChart(sample) {
  d3.json(dataURL).then((data) => {
    const samples = data.samples;
    const result = samples.find(sampleObj => sampleObj.id === sample);

    if (!result) {
      console.error("Sample not found!");
      return;
    }

    // Extract data
    const otu_ids = result.otu_ids;
    const sample_values = result.sample_values;
    const otu_labels = result.otu_labels;

    // Define the trace for the bubble chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Define layout
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest",
      margin: { l: 50, r: 50, t: 50, b: 50 }
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to display metadata (demographic information)
function buildMetadata(sample) {
  d3.json(dataURL).then((data) => {
    const metadata = data.metadata;
    const result = metadata.find(sampleObj => sampleObj.id == sample);

    // Select the metadata panel
    const panel = d3.select("#sample-metadata");

    // Clear existing metadata
    panel.html("");

    // Check if data exists
    if (result) {
      // Append key-value pairs
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    } else {
      panel.append("h6").text("No metadata found.");
    }
  });
}

// Function to initialize the dashboard
function init() {
  d3.json(dataURL).then((data) => {
    const sampleNames = data.names;

    // Select the dropdown menu
    const dropdown = d3.select("#selDataset");

    // Populate dropdown options
    sampleNames.forEach((sample) => {
      dropdown.append("option").attr("value", sample).text(sample);
    });

    // Build initial charts and metadata with the first sample
    const firstSample = sampleNames[0];
    buildBarChart(firstSample);
    buildBubbleChart(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to update plots when new sample is selected
function optionChanged(newSample) {
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

