import axios from "axios";

async function getUser(user) {
  try {
    const response = await axios.get(`https://api.github.com/users/${user}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

async function getTopRepositories() {
  try {
    const response = await axios.get(
      "https://api.github.com/search/repositories?q=stars:>0&sort=stars&order=desc&per_page=10"
    );
    return response.data.items;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

async function getAllFilesInDirectory(owner, repo, path) {
  try {
    // Fetch the repository tree recursively
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
      {
        headers: {
          Authorization: `token ${process.env.VITE_ACCESS_TOKEN}`,
        },
      }
    );

    // Filter the files in the specified path
    const files = response.data.tree.filter((item) => {
      return item.type === "blob" && item.path.startsWith(path);
    });

    return files;
  } catch (error) {
    console.error("Error fetching files:", error.message);
    return [];
  }
}

export { getUser, getTopRepositories, getAllFilesInDirectory };
