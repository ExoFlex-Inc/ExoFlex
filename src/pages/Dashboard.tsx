import { Box, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import StretchStreak from "../components/StretchStreak";
import { useStats } from "../hooks/use-stats";
import Loading from "../components/Loading";
import Leaderboard from "../components/Leaderboard";
import { useUser } from "../hooks/use-user";

export default function Dashboard() {
  const { user } = useUser();
  const { stats, isLoading: statsLoading } = useStats();
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const hasPermissions =
    user.permissions === "dev" || user.permissions === "client";

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/stat/top_users", {
          method: "GET",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error fetching top users: ${response.status} ${errorText}`,
          );
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (statsLoading || usersLoading) {
    return (
      <Box
        sx={{
          position: "relative",
          height: "calc(100vh - 100px)",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {hasPermissions && (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats && (
              <StretchStreak
                currentStreak={stats.current_streak}
                longestStreak={stats.longest_streak}
              />
            )}
            <Leaderboard
              users={users}
              currentUser={users?.find((u) => u.user_id === user.user_id)}
            />
          </Grid>
        </Container>
      )}
    </Box>
  );
}
