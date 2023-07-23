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

    // Sort the files by path in descending order (latest file first)
    files.sort((a, b) => (a.path > b.path ? -1 : 1));

    return files;
  } catch (error) {
    console.error("Error fetching files:", error.message);
    return [];
  }
}

export { getUser, getAllFilesInDirectory };
