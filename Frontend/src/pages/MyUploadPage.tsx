import { useSelector } from "react-redux"
import { RootState } from "../Redux/store";
import { useEffect, useState } from "react";
import { Scenery } from "../models/Scenery";
import agent from "../api/agent";
import { Box, Button, CircularProgress, Grid, Pagination, Switch, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import SingleScenery from "./SingleScenery";

export default function MyUploadPage() {
    // Responsive styling
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // Fetch userId and token from Redux store
    const userId = useSelector((state: RootState) => state.auth.userId);
    const token = useSelector((state: RootState) => state.auth.token);
    // State variables
    const [upload, setUpload] = useState<Scenery[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [sortBy, setSortBy] = useState<string>("sceneryName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sorting, setSorting] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState<string>("sceneryName");
    const [forceUpdate, setForceUpdate] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUpload, setFilteredUpload] = useState<Scenery[]>([]);

    // Fetch user uploaded sceneries when userId, token, or forceUpdate changes
    useEffect(() => {
        const fetchUpload = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                setSorting(true);
                const response = await agent.fetchUserUpload(userId, config);
                sortUpload(response);
                setSorting(false);
            } catch (error) {
                console.error('Error fetching user collection:', error);
            }
        };

        if (userId) {
            fetchUpload();
        }
    }, [userId, token, forceUpdate]);

    // Handle search input changes
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        filterUpload(query);
    };

    // Filter sceneries based on search query
    const filterUpload = (query: string) => {
        const lowercasedQuery = query.toLowerCase();
        const filteredData = upload.filter((item) =>
            item.sceneryName.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredUpload(filteredData);
    };

    // Sort the uploads based on the sort criteria
    const sortUpload = (response: Scenery[], order: "asc" | "desc" = sortOrder) => {
        setSorting(true);
        try {
            const sortedUpload = [...response].sort((a, b) => {
                if (sortBy === "sceneryName") {
                    return (order === "asc" ? a.sceneryName.localeCompare(b.sceneryName) : b.sceneryName.localeCompare(a.sceneryName));
                } else if (sortBy === "country") {
                    return (order === "asc" ? a.country.localeCompare(b.country) : b.country.localeCompare(a.country));
                } else if (sortBy === "city") {
                    return (order === "asc" ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city));
                }
                return 0;
            });
            setUpload(sortedUpload);
        } catch (error) {
            console.error('Error sorting uploads:', error);
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
        sortUpload(upload, newSortOrder);
    }

    // Calculate the items to be displayed on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchQuery !== '' ?
        filteredUpload.slice(indexOfFirstItem, indexOfLastItem) :
        upload.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh' }}>
            {/* Sidebar for searching and sorting options */}
            <Box
                sx={{
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '100%' : '300px',
                    padding: '10px',
                    backgroundColor: '#eeeee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    justifyContent: 'flex-start',
                    flexShrink: 0,
                }}
            >
                {/* Search functionality */}
                <Typography variant='body1' sx={{ marginRight: 1, mb: 2, flexShrink: 0 }}>
                    Search&nbsp;Scenery&nbsp;Name:
                </Typography>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    sx={{ marginBottom: 1, flexShrink: 0, width: isMobile ? '100%' : 'auto' }}
                />
                <br />
                {/* Sort functionality */}
                <Typography variant='body1' sx={{ marginRight: 1, mb: 2, flexShrink: 0 }}>
                    Sort&nbsp;By:
                </Typography>
                <Button
                    variant={selectedSortOption === "sceneryName" ? "contained" : "outlined"}
                    onClick={() => handleSort("sceneryName")}
                    sx={{ marginBottom: 1, width: isMobile ? '100%' : 'auto' }}
                >
                    Name
                </Button>
                <Button
                    variant={selectedSortOption === "country" ? "contained" : "outlined"}
                    onClick={() => handleSort("country")}
                    sx={{ marginBottom: 1, width: isMobile ? '100%' : 'auto' }}
                >
                    Country
                </Button>
                <Button
                    variant={selectedSortOption === "city" ? "contained" : "outlined"}
                    onClick={() => handleSort("city")}
                    sx={{ marginBottom: 1, width: isMobile ? '100%' : 'auto' }}
                >
                    City
                </Button>
                <br />
                {/* Switch for sorting order */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2, flexShrink: 0 }}>
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
                {/* Display message if upload list is empty */}
                {upload.length === 0 && !sorting && (
                    <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
                        You have't uploaded any scenery.
                    </Typography>
                )}
                {/* Display message if filtered collection list is empty */}
                {filteredUpload.length === 0 && searchQuery !== '' && (
                    <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
                        No matching uploads found.
                    </Typography>
                )}

                {/* Display sorted/searched upload items */}
                <Grid container spacing={2}>
                    {currentItems.map(c => (
                        <Grid item xs={12} sm={6} md={4} key={c.sceneryId}>
                            <SingleScenery scenery={c} />
                        </Grid>
                    ))}
                </Grid>
                {/* Pagination component */}
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={Math.ceil((searchQuery !== '' ?
                            filteredUpload.length :
                            upload.length)
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