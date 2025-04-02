import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const BASE_URL = "http://20.244.56.144/evaluation-service";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjEwODk0LCJpYXQiOjE3NDM2MTA1OTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQzNzgwNGIyLWI1MzktNGVhNi1iYmRhLWUxY2M3ODkzMjcyZSIsInN1YiI6IjIyMDUyMDMzQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MjAzM0BraWl0LmFjLmluIiwibmFtZSI6Imx1Y2t5IGt1bWFyIiwicm9sbE5vIjoiMjIwNTIwMzMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI0Mzc4MDRiMi1iNTM5LTRlYTYtYmJkYS1lMWNjNzg5MzI3MmUiLCJjbGllbnRTZWNyZXQiOiJXYmZaRnh5Z3FVWEdTVU52In0.qFvbaoshxqO8jjOStdMl6Ne6VGdqNiPL7ipasc17kOE"
export const  getTopUsers = async (req, res) => {
    try {
    
        const response = await axios.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });


        const usersObject = response.data.users;
        if (!usersObject || typeof usersObject !== 'object') {
            throw new Error("Invalid response: Expected an object of users");
        }

        const users = Object.entries(usersObject).map(([id, username]) => ({
            id,
            username
        }));

        const userPostCounts = await Promise.all(
            users.map(async (user) => {
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

