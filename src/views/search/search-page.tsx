'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Typography,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SearchCard from 'components/SearchCard/SearchCard';
import NoSearchResults from 'components/SearchCard/NoSearchResults';
import { IMovieDetailed } from 'types/movies';
import { IShow } from 'types/tv';
import { moviesApi } from 'services/moviesApi';
import { tvApi } from 'services/tvApi';

const PAGE_SIZE = 10;

// Define available filters for each content type based on the API
interface FilterDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { value: string; label: string }[];
  apiParam: string;
}

const MOVIE_FILTERS: FilterDefinition[] = [
  { key: 'q', label: 'Title', type: 'text', apiParam: 'q' },
  { key: 'genre', label: 'Genre', type: 'text', apiParam: 'genre' },
  { key: 'yearMin', label: 'Year (Min)', type: 'number', apiParam: 'yearMin' },
  { key: 'yearMax', label: 'Year (Max)', type: 'number', apiParam: 'yearMax' },
  { key: 'director', label: 'Director', type: 'text', apiParam: 'director' },
  { key: 'actor', label: 'Actor', type: 'text', apiParam: 'actor' },
  {
    key: 'mpaRating',
    label: 'MPA Rating',
    type: 'select',
    apiParam: 'mpaRating',
    options: [
      { value: 'G', label: 'G - General Audiences' },
      { value: 'PG', label: 'PG - Parental Guidance' },
      { value: 'PG-13', label: 'PG-13' },
      { value: 'R', label: 'R - Restricted' },
      { value: 'NC-17', label: 'NC-17' }
    ]
  }
];

const TV_FILTERS: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text', apiParam: 'name' },
  { key: 'genre', label: 'Genre', type: 'text', apiParam: 'genre' },
  { key: 'network', label: 'Network', type: 'text', apiParam: 'network' },
  { key: 'castMember', label: 'Cast Member', type: 'text', apiParam: 'castMember' },
  { key: 'minrating', label: 'Min Rating', type: 'number', apiParam: 'minrating' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    apiParam: 'status',
    options: [
      { value: 'Returning Series', label: 'Returning Series' },
      { value: 'Ended', label: 'Ended' },
      { value: 'Cancelled', label: 'Cancelled' },
      { value: 'Pilot', label: 'Pilot' }
    ]
  }
];

interface FilterValue {
  id: string;
  filterKey: string;
  value: string;
}

type ContentType = 'movie' | 'tv';

export default function SearchView() {
  const [searchMovieData, setSearchMovieData] = useState<IMovieDetailed[]>([]);
  const [searchShowData, setSearchShowData] = useState<IShow[]>([]);
  const [searchType, setSearchType] = useState<ContentType>('tv');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Dynamic filters state - default to first filter option
  const [filters, setFilters] = useState<FilterValue[]>([{ id: crypto.randomUUID(), filterKey: TV_FILTERS[0].key, value: '' }]);

  const currentFilters = searchType === 'movie' ? MOVIE_FILTERS : TV_FILTERS;

  const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newCategory: ContentType) => {
    if (newCategory !== null) {
      setSearchType(newCategory);
      setCurrentPage(1);
      // Reset filters to default for the new content type
      const defaultFilters = newCategory === 'movie' ? MOVIE_FILTERS : TV_FILTERS;
      setFilters([{ id: crypto.randomUUID(), filterKey: defaultFilters[0].key, value: '' }]);
      // Clear results
      setSearchMovieData([]);
      setSearchShowData([]);
      setError('');
      setHasSearched(false);
    }
  };

  const addFilter = () => {
    const usedKeys = filters.map((f) => f.filterKey);
    const availableFilter = currentFilters.find((f) => !usedKeys.includes(f.key));

    if (availableFilter) {
      setFilters([...filters, { id: crypto.randomUUID(), filterKey: availableFilter.key, value: '' }]);
    }
  };

  const removeFilter = (id: string) => {
    if (filters.length > 1) {
      setFilters(filters.filter((f) => f.id !== id));
    }
  };

  const updateFilter = (id: string, field: 'filterKey' | 'value', newValue: string) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, [field]: newValue } : f)));
  };

  const buildApiParams = useCallback(() => {
    const params: any = {
      limit: PAGE_SIZE,
      offset: (currentPage - 1) * PAGE_SIZE
    };

    filters.forEach((filter) => {
      if (filter.value.trim()) {
        const filterDef = currentFilters.find((f) => f.key === filter.filterKey);
        if (filterDef) {
          // Convert to number if it's a number type
          params[filterDef.apiParam] = filterDef.type === 'number' ? Number(filter.value.trim()) : filter.value.trim();
        }
      }
    });

    return params;
  }, [currentPage, filters, currentFilters]);

  const performSearch = useCallback(async () => {
    const hasValue = filters.some((f) => f.value.trim());
    if (!hasValue) {
      setError('Please enter at least one search criterion');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setError('');

    try {
      const params = buildApiParams();

      if (searchType === 'movie') {
        // Check if we're using the text search or filter search
        const hasTextSearch = params.q;
        const hasOtherFilters = Object.keys(params).some((key) => !['q', 'limit', 'offset'].includes(key));

        let response;

        if (hasTextSearch && !hasOtherFilters) {
          // Only text search - use search endpoint
          response = await moviesApi.search({ params: { q: params.q } });
        } else if (!hasTextSearch && hasOtherFilters) {
          // Only filters - use filter endpoint
          const filterParams = { ...params };
          delete filterParams.q;
          response = await moviesApi.searchByFilter({ params: filterParams });
        } else if (hasTextSearch && hasOtherFilters) {
          // Both text search AND filters - use filter endpoint and filter by title client-side
          const SEARCH_LIMIT = 100;
          const filterParamsWithLimit = { ...params, limit: SEARCH_LIMIT, offset: 0 };
          delete filterParamsWithLimit.q;

          const filterResponse = await moviesApi.searchByFilter({ params: filterParamsWithLimit });

          const filterData = filterResponse.data.data || filterResponse.data;
          const filterMovies = filterData.data || filterData || [];

          // Filter by title on client side
          const searchTerm = params.q.toLowerCase();
          const allCombinedResults = filterMovies.filter((movie: any) => {
            const title = (movie.title || movie.movie_title || '').toLowerCase();
            return title.includes(searchTerm);
          });

          // Apply client-side pagination
          const startIndex = (currentPage - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
          const paginatedResults = allCombinedResults.slice(startIndex, endIndex);

          // Create a mock response structure
          response = {
            data: {
              data: {
                data: paginatedResults,
                pagination: {
                  totalCount: allCombinedResults.length,
                  limit: PAGE_SIZE,
                  offset: startIndex
                }
              }
            }
          };
        } else {
          // No search criteria
          setError('Please enter at least one search criterion');
          setIsLoading(false);
          return;
        }

        // Movie API response structure: response.data.data.data (nested)
        const responseData = response.data.data || response.data;
        const movieData = responseData.data || responseData || [];

        setSearchMovieData(movieData);
        setTotalCount(responseData.pagination?.totalCount || 0);
        setSearchShowData([]);
      } else {
        // TV search
        const response = await tvApi.search({ params });
        const data = response.data;

        setSearchShowData(data.data || data || []);
        // TV API doesn't provide total count, estimate based on results
        setTotalCount(
          Array.isArray(data.data || data) && (data.data || data).length === PAGE_SIZE
            ? (currentPage + 1) * PAGE_SIZE
            : currentPage * PAGE_SIZE
        );
        setSearchMovieData([]);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Search failed. Please try again.');
      setSearchMovieData([]);
      setSearchShowData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, buildApiParams, searchType, currentPage]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await performSearch();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Trigger search when page changes
  useEffect(() => {
    if (currentPage > 1) {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const totalPages = searchType === 'movie' && totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : undefined;

  const isLastPage = searchType === 'movie' ? currentPage >= (totalPages || 1) : searchShowData.length < PAGE_SIZE;

  const hasResults = (searchType === 'tv' && searchShowData.length > 0) || (searchType === 'movie' && searchMovieData.length > 0);

  const getAvailableFilters = (currentId: string) => {
    const usedKeys = filters.filter((f) => f.id !== currentId).map((f) => f.filterKey);
    return currentFilters.filter((f) => !usedKeys.includes(f.key));
  };

  const canAddMore = filters.length < currentFilters.length;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="column" gap={3}>
        {/* Header */}
        <Typography variant="h4" component="h1">
          Search {searchType === 'movie' ? 'Movies' : 'TV Shows'}
        </Typography>

        {/* Content Type Toggle */}
        <Box>
          <ToggleButtonGroup value={searchType} exclusive onChange={handleCategoryChange} color="primary">
            <ToggleButton value="movie">Movies</ToggleButton>
            <ToggleButton value="tv">TV Shows</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search Form */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <form onSubmit={handleSearch}>
            <Stack direction="column" gap={2}>
              <Typography variant="h6" gutterBottom>
                Search Filters
              </Typography>

              {filters.map((filter) => {
                const filterDef = currentFilters.find((f) => f.key === filter.filterKey);
                const availableFilters = getAvailableFilters(filter.id);

                return (
                  <Stack key={filter.id} direction="row" gap={2} alignItems="center">
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel>Filter By</InputLabel>
                      <Select
                        value={filter.filterKey}
                        label="Filter By"
                        onChange={(e) => updateFilter(filter.id, 'filterKey', e.target.value)}
                        size="medium"
                      >
                        {availableFilters.map((f) => (
                          <MenuItem key={f.key} value={f.key}>
                            {f.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {filterDef?.type === 'select' ? (
                      <FormControl sx={{ flex: 1 }}>
                        <InputLabel>{filterDef.label}</InputLabel>
                        <Select
                          value={filter.value}
                          label={filterDef.label}
                          onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                          size="medium"
                        >
                          <MenuItem value="">
                            <em>Any</em>
                          </MenuItem>
                          {filterDef.options?.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        sx={{ flex: 1 }}
                        label={filterDef?.label}
                        type={filterDef?.type === 'number' ? 'number' : 'text'}
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                        placeholder={`Enter ${filterDef?.label.toLowerCase()}`}
                        size="medium"
                        inputProps={filterDef?.type === 'number' ? { min: 0, step: filterDef.key.includes('rating') ? 0.1 : 1 } : {}}
                      />
                    )}

                    <IconButton
                      onClick={() => removeFilter(filter.id)}
                      disabled={filters.length === 1}
                      color="error"
                      aria-label="Remove filter"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}

              <Stack direction="row" gap={2} alignItems="center">
                <Button startIcon={<AddIcon />} onClick={addFilter} disabled={!canAddMore} variant="outlined" size="medium">
                  Add Filter
                </Button>

                {!canAddMore && (
                  <Typography variant="caption" color="text.secondary">
                    All available filters have been added
                  </Typography>
                )}

                <Button type="submit" variant="contained" disabled={isLoading} sx={{ ml: 'auto', minWidth: 120 }} size="large">
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Loading results...</Typography>
          </Box>
        )}

        {/* Results */}
        {!isLoading && (
          <Stack direction="column" gap={2}>
            {searchType === 'tv' &&
              searchShowData.length > 0 &&
              searchShowData.map((item) => <SearchCard key={item.iD} contentId={item.iD} contentType={searchType} contentData={item} />)}

            {searchType === 'tv' && searchShowData.length === 0 && !filters.some((f) => f.value.trim()) && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Enter search criteria and click Search to find TV shows
                </Typography>
              </Box>
            )}

            {searchType === 'tv' && searchShowData.length === 0 && filters.some((f) => f.value.trim()) && hasSearched && (
              <NoSearchResults type="TV show" />
            )}

            {searchType === 'movie' &&
              searchMovieData.length > 0 &&
              searchMovieData.map((item) => (
                <SearchCard key={item.movie_id} contentId={item.movie_id} contentType={searchType} contentData={item} />
              ))}

            {searchType === 'movie' && searchMovieData.length === 0 && !filters.some((f) => f.value.trim()) && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Enter search criteria and click Search to find movies
                </Typography>
              </Box>
            )}

            {searchType === 'movie' && searchMovieData.length === 0 && filters.some((f) => f.value.trim()) && hasSearched && (
              <NoSearchResults type="movie" />
            )}
          </Stack>
        )}

        {/* Pagination */}
        {hasResults && !isLoading && (
          <Paper elevation={1} sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
              <Button variant="outlined" onClick={handlePreviousPage} disabled={currentPage === 1 || isLoading} size="medium">
                Previous
              </Button>

              <Box sx={{ minWidth: 150, textAlign: 'center' }}>
                <Typography variant="body1">
                  Page {currentPage}
                  {totalPages && <> of {totalPages}</>}
                </Typography>
                {searchType === 'movie' && totalCount > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {totalCount} total results
                  </Typography>
                )}
              </Box>

              <Button variant="outlined" onClick={handleNextPage} disabled={isLastPage || isLoading} size="medium">
                Next
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}