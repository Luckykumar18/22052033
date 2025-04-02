import axios from "axios";

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjEwODk0LCJpYXQiOjE3NDM2MTA1OTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQzNzgwNGIyLWI1MzktNGVhNi1iYmRhLWUxY2M3ODkzMjcyZSIsInN1YiI6IjIyMDUyMDMzQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MjAzM0BraWl0LmFjLmluIiwibmFtZSI6Imx1Y2t5IGt1bWFyIiwicm9sbE5vIjoiMjIwNTIwMzMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI0Mzc4MDRiMi1iNTM5LTRlYTYtYmJkYS1lMWNjNzg5MzI3MmUiLCJjbGllbnRTZWNyZXQiOiJXYmZaRnh5Z3FVWEdTVU52In0.qFvbaoshxqO8jjOStdMl6Ne6VGdqNiPL7ipasc17kOE";

export async function getPosts() {
    try {
        
        const { data } = await axios.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
            timeout: 5000
        });
  
        
        const usersObject = data.users;
        if (!usersObject || typeof usersObject !== "object") {
            throw new Error("Invalid users data");
        }
  
        
        const postPromises = Object.entries(usersObject).map(async ([id, username]) => {
            try {
                const { data: postsData } = await axios.get(`${BASE_URL}/users/${id}/posts`, {
                    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
                    timeout: 3000
                });
                return postsData?.posts || [];
            } catch (error) {
                console.error(`Posts fetch failed for ${username}:`, error.message);
                return [];
            }
        });
  
     
        const allPosts = (await Promise.all(postPromises)).flat();
        return allPosts.filter(post => Boolean(post)); // Remove empty entries
  
    } catch (error) {
        console.error("Critical Error:", error.message);
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
}
