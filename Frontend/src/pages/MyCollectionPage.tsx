import { useSelector } from "react-redux"
import { RootState } from "../Redux/store";
import { useEffect, useState } from "react";
import { Scenery } from "../models/Scenery";
import agent from "../api/agent";
import { Box, Button, Grid, Pagination, Switch, Typography } from "@mui/material";
import SingleScenery from "./SingleScenery";

export default function MyCollectionPage() {
    const userId = useSelector((state: RootState) => state.auth.userId);
    const [collection, setCollection] = useState<Scenery[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [sortBy, setSortBy] = useState<string>("sceneryName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedSortOption, setSelectedSortOption] = useState<string>("sceneryName");
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                const response = await agent.fetchUserCollection(userId, config);
                sortCollection(response);
            } catch (error) {
                console.error('Error fetching user collection:', error);
            }
        };

        if (userId) {
            fetchCollection();
        }
    }, [userId, token, forceUpdate]);

    const sortCollection = (response: Scenery[], order: "asc" | "desc" = sortOrder) => {
        const sortedCollection = [...response].sort((a, b) => {
            if (sortBy === "sceneryName") {
                return (order === "asc" ? a.sceneryName.localeCompare(b.sceneryName) : b.sceneryName.localeCompare(a.sceneryName));
            } else if (sortBy === "country") {
                return (order === "asc" ? a.country.localeCompare(b.country) : b.country.localeCompare(a.country));
            } else if (sortBy === "city") {
                return (order === "asc" ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city));
            }
            return 0;
        });

        setCollection(sortedCollection);
    };

    const handleSort = (criteria: string) => {
        if (criteria === selectedSortOption) {
            setSelectedSortOption("");
            setSortBy("");
        } else {
            setSelectedSortOption(criteria);
            setSortBy(criteria);
        }
        setForceUpdate(prev => !prev);
    };

    const handleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        sortCollection(collection, newSortOrder);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = collection.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ display: 'flex' }}>
            <Box
                sx={{
                    width: '20%',
                    padding: '10px',
                    backgroundColor: '#eeeee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    justifyContent: 'flex-start',
                }}
            >
                <Typography variant='body1' sx={{ marginRight: 1, mb: 2 }}>
                    Sort&nbsp;By:
                </Typography>
                <Button
                    variant={selectedSortOption === "sceneryName" ? "contained" : "outlined"}
                    onClick={() => handleSort("sceneryName")}
                    sx={{ marginBottom: 1 }}
                >
                    Name
                </Button>
                <Button
                    variant={selectedSortOption === "country" ? "contained" : "outlined"}
                    onClick={() => handleSort("country")}
                    sx={{ marginBottom: 1 }}
                >
                    Country
                </Button>
                <Button
                    variant={selectedSortOption === "city" ? "contained" : "outlined"}
                    onClick={() => handleSort("city")}
                    sx={{ marginBottom: 1 }}
                >
                    City
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <Typography variant='body1' sx={{ marginRight: 1 }}>
                        Sort&nbsp;Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </Typography>
                    <Switch
                        checked={sortOrder === "desc"}
                        onChange={handleSortOrder}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    flex: '1',
                    padding: '20px',
                    overflowY: 'auto',
                }}
            >
                <Grid container spacing={2}>
                    {collection.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center" sx={{ mt: 35 }}>
                                No items in your collection.
                            </Typography>
                        </Grid>
                    ) : (
                        currentItems.map(c => (
                            <Grid item xs={4} key={c.sceneryId}>
                                <SingleScenery scenery={c} />
                            </Grid>
                        ))
                    )}
                </Grid>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={Math.ceil(collection.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Grid>
            </Box>
        </div>
    )
}