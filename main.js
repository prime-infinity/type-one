import { getUser, getAllFilesInDirectory } from "./data";
import axios from "axios";

// Function to decode Base64 content
function decodeBase64(base64String) {
  const decodedString = atob(base64String);
  const uint8Array = new Uint8Array(decodedString.length);
  for (let i = 0; i < decodedString.length; i++) {
    uint8Array[i] = decodedString.charCodeAt(i);
  }
  return uint8Array;
}

async function downloadFile(url) {
  try {
    const response = await axios.get(url);

    // Decode the Base64 content
    const decodedContent = decodeBase64(response.data.content);

    // Create a Blob from the decoded content
    const blob = new Blob([decodedContent], { type: "text/csv" });

    // Generate a temporary download link and click it to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "github-ranking.csv"; // Set the desired file name
    link.click();
  } catch (error) {
    console.error("Error downloading file:", error.message);
  }
}

async function fetchData() {
  const owner = "EvanLi";
  const repo = "Github-Ranking";
  const path = "Data";

  const files = await getAllFilesInDirectory(owner, repo, path);
  if (files.length > 0) {
    // Get the last file's URL
    const lastFileUrl = files[files.length - 1].url;

    // Download the last file
    downloadFile(lastFileUrl);
  }
}

fetchData();
