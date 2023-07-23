import { getUser, getTopRepositories, getAllFilesInDirectory } from "./data";

async function fetchData() {
  /*const username = "prime-infinity";
  const user = await getUser(username);
  if (user) {
    //console.log("GitHub User:", user);
  }*/

  /*const topRepositories = await getTopRepositories();
  if (topRepositories) {
    console.log("Top 10 Repositories by Stars:", topRepositories);
  }*/

  // Example usage
  const owner = "EvanLi";
  const repo = "Github-Ranking";
  const path = "Data";

  const topReposByStars = await getAllFilesInDirectory(owner, repo, path)
    .then((files) => {
      console.log(files);
      // Process the files as needed
    })
    .catch((error) => {
      console.error("Error fetching files:", error.message);
    });
}

fetchData();
