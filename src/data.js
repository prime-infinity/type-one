import axios from "axios";

// Function to get details of a random GitHub user
async function getUser(user) {
  try {
    const response = await axios.get(`https://api.github.com/users/${user}`);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}
export { getUser };
