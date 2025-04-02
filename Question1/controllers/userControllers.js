import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const BASE_URL = "http://20.244.56.144/evaluation-service";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjA5NzI0LCJpYXQiOjE3NDM2MDk0MjQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQzNzgwNGIyLWI1MzktNGVhNi1iYmRhLWUxY2M3ODkzMjcyZSIsInN1YiI6IjIyMDUyMDMzQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MjAzM0BraWl0LmFjLmluIiwibmFtZSI6Imx1Y2t5IGt1bWFyIiwicm9sbE5vIjoiMjIwNTIwMzMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI0Mzc4MDRiMi1iNTM5LTRlYTYtYmJkYS1lMWNjNzg5MzI3MmUiLCJjbGllbnRTZWNyZXQiOiJXYmZaRnh5Z3FVWEdTVU52In0.R8BYZ_eQCE0Hg0oNcMcFWItAFky83wuRwMI8b2uUVmg";

export const getTopUsers = async (req, res) => {
    try {
        if (!ACCESS_TOKEN) {
            throw new Error("Access token is missing. Check environment variables.");
        }

        // Fetch all users
        const response = await axios.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });

        const users = response.data;
        if (!Array.isArray(users)) {
            throw new Error("Invalid response: Expected an array of users");
        }

        // Fetch post counts concurrently
        const userPostCounts = await Promise.all(
            users.map(async (user) => {
                if (!user.id || !user.username) {
                    return { id: user.id || "unknown", username: user.username || "unknown", postCount: 0 };
                }

                try {
                    const { data: posts } = await axios.get(`${BASE_URL}/users/${user.id}/posts`, {
                        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
                    });

                    return {
                        id: user.id,
                        username: user.username,
                        postCount: Array.isArray(posts) ? posts.length : posts?.posts?.length || 0
                    };
                } catch (error) {
                    console.error(`Error fetching posts for ${user.username}:`, error.message);
                    return { id: user.id, username: user.username, postCount: 0 }; 
                }
            })
        );

        // Sort and return top 5 users by post count
        const topUsers = userPostCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);
        return res.json(topUsers);

    } catch (error) {
        console.error("Error fetching top users:", error.message);

        return res.status(error.response?.status || 500).json({
            error: error.response?.status === 401 ? "Invalid or expired access token" : "API request failed",
            details: error.message
        });
    }
};
