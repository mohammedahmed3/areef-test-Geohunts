   const fetchLeaderboardData = async (category) => {
     const response = await axios.get(`/leaderboards/${category}`);
     setLeaderboard(response.data);
   };