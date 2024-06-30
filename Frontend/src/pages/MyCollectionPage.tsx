import { useSelector } from "react-redux"
import { RootState } from "../Redux/store";
import { useEffect, useState } from "react";
import { Scenery } from "../models/Scenery";
import agent from "../api/agent";
import { Box, Button, CircularProgress, Grid, Pagination, Switch, TextField, Typography } from "@mui/material";
import SingleScenery from "./SingleScenery";

export default function MyCollectionPage() {
    // Fetch userId and token from Redux store
    const userId = useSelector((state: RootState) => state.auth.userId);
    const token = useSelector((state: RootState) => state.auth.token);
    // State variables
    const [collection, setCollection] = useState<Scenery[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [sortBy, setSortBy] = useState<string>("sceneryName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sorting, setSorting] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState<string>("sceneryName");
    const [forceUpdate, setForceUpdate] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCollection, setFilteredCollection] = useState<Scenery[]>([]);

    // Fetch user collection when userId, token, or forceUpdate changes
    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                setSorting(true);
                const response = await agent.fetchUserCollection(userId, config);
                sortCollection(response);
                setSorting(false);
            } catch (error) {
                console.error('Error fetching user collection:', error);
            }
        };

        if (userId) {
            fetchCollection();
        }
    }, [userId, token, forceUpdate]);

    // Handle search input changes
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        filterCollection(query);
    };

    // Filter collection based on search query
    const filterCollection = (query: string) => {
        const lowercasedQuery = query.toLowerCase();
        const filteredData = collection.filter((item) =>
            item.sceneryName.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredCollection(filteredData);
    };

    // Sort the collection based on the sort criteria
    const sortCollection = (response: Scenery[], order: "asc" | "desc" = sortOrder) => {
        setSorting(true);
        try {
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
        } catch (error) {
            console.error('Error sorting collections:', error);
        } finally {
            setSorting(false);
        }
    };

    // Handle sorting criteria change
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

    // Handle sorting order change
    const handleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        sortCollection(collection, newSortOrder);
    }

    // Calculate the items to be displayed on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchQuery !== '' ?
        filteredCollection.slice(indexOfFirstItem, indexOfLastItem) :
        collection.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar for searching and sorting options */}
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
                {/* Search functionality */}
                <Typography variant='body1' sx={{ marginRight: 1, mb: 2 }}>
                    Search&nbsp;Scenery&nbsp;Name:
                </Typography>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    sx={{ marginBottom: 1 }}
                />
                <br />
                {/* Sort functionality */}
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
                <br />
                {/* Switch for sorting order */}
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

            {/* Main content area */}
            <Box
                sx={{
                    flex: '1',
                    padding: '20px',
                    overflowY: 'auto',
                }}
            >
                {/* Display loading spinner while sorting */}
                {sorting && (
                    <CircularProgress
                        size={40}
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />
                )}
                {/* Display message if collection list is empty */}
                {collection.length === 0 && !sorting && (
                    <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
                        You haven't make any collection.
                    </Typography>
                )}
                {/* Display message if filtered collection list is empty */}
                {filteredCollection.length === 0 && searchQuery !== '' && (
                    <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
                        No matching collection found.
                    </Typography>
                )}

                {/* Display sorted/searched collection items */}
                <Grid container spacing={2}>
                    {currentItems.map(c => (
                        <Grid item xs={4} key={c.sceneryId}>
                            <SingleScenery scenery={c} />
                        </Grid>
                    ))}
                </Grid>
                {/* Pagination component */}
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={Math.ceil((searchQuery !== '' ?
                            filteredCollection.length :
                            collection.length)
                            / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Grid>
            </Box>
        </div>
    )
}