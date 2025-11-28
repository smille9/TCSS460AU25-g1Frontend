'use client';

import { useState } from 'react';
import { Box, Stack, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import SearchCard from 'components/SearchCard/SearchCard';
import NoSearchResults from 'components/SearchCard/NoSearchResults';
import { IMovieDetailed } from 'types/movies';
import { IShow } from 'types/tv';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FilterType, IFilterMethodParams, filterMethods, searchMappings } from './filterMethods';

const PAGE_SIZE = 10;

export default function SearchView() {
  const [searchMovieData, setSearchMovieData] = useState<IMovieDetailed[]>([]);
  const [searchShowData, setSearchShowData] = useState<IShow[]>([]);
  const [searchType, setSearchType] = useState<FilterType>('tv');
  const [filterOptions, setFilterOptions] = useState<IFilterMethodParams[]>(filterMethods.tv);
  const [currentPage, setCurrentPage] = useState<number>(1);
  //const queryParams = useSearchParams();

  // useEffect(() => {
  //   const title = queryParams.get('title');

  //   if (title) {
  //     tvApi.search({ params: { name: title } }).then((response) => {
  //       setSearchShowData(response.data.data);
  //     });
  //   }
  //   setSearchMovieData([]);
  // }, [queryParams]);

  const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newCategory: 'movie' | 'tv') => {
    setSearchType(newCategory);
    setCurrentPage(1); // reset the page when the user switches between movies and tv results
    searchForm.submitForm(); // RESUBMIT form to get page 1
    // Helps determine the dropdown options for filters
    if (newCategory === 'movie') {
      setFilterOptions(filterMethods.movie);
    } else {
      setFilterOptions(filterMethods.tv);
    }
  };

  const searchForm = useFormik({
    initialValues: { search: '', searchBy: 'title' },
    validationSchema: Yup.object({
      search: Yup.string().required('Search field is required').max(128)
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      const searchBy = values.searchBy as keyof typeof searchMappings;

      if (searchMappings[searchBy]) {
        const { tv, movie } = searchMappings[searchBy];

        try {
          const offset = (currentPage - 1) * PAGE_SIZE;
          const pagination = { limit: PAGE_SIZE, offset };

          // TODO: Pass limit and offset to the API calls
          const [tvResponse, movieResponse] = await Promise.all([tv(values.search, pagination), movie(values.search, pagination)]);

          setSearchShowData(tvResponse.data.data);
          setSearchMovieData(movieResponse.data.data.data);
        } catch (error) {
          setErrors({ search: 'Search failed.' });
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      } else {
        setErrors({ searchBy: 'Improper search-by filter' });
        setSubmitting(false);
      }
    }
  });

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      searchForm.submitForm(); // Re-submit the form with new page
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    searchForm.submitForm(); // Re-submit the form with new page
  };

  // to control whether pagination buttons are visible
  const hasResults = (searchType === 'tv' && searchShowData.length > 0) || (searchType === 'movie' && searchMovieData.length > 0);

  return (
    <Box>
      <Stack direction="row" gap="16px">
        {/* Search */}
        <form onSubmit={searchForm.handleSubmit}>
          <input type="text" id="search" {...searchForm.getFieldProps('search')} />
          <button type="submit" disabled={searchForm.isSubmitting}>
            Search
          </button>
          <label htmlFor="searchBy">Search by:</label>
          <select id="searchBy" {...searchForm.getFieldProps('searchBy')}>
            {filterOptions
              .filter((item) => item.type === 'text')
              .map((opt) => (
                <option key={searchType + opt.filter} value={opt.filter}>
                  {opt.label}
                </option>
              ))}
          </select>
        </form>
        <Stack direction="row" gap="8px">
          {/* buttons */}
          <ToggleButtonGroup value={searchType} exclusive onChange={handleCategoryChange}>
            <ToggleButton value="movie">
              <Box>Movies</Box>
            </ToggleButton>
            <ToggleButton value="tv">
              <Box>TV</Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <Stack direction="column" gap="16px">
        {searchShowData && searchShowData.length && searchType === 'tv'
          ? searchShowData.map((item) => <SearchCard key={item.iD} contentId={item.iD} contentType={searchType} contentData={item} />)
          : searchType === 'tv' && <NoSearchResults type="TV show" />}

        {searchMovieData && searchMovieData.length && searchType === 'movie'
          ? searchMovieData.map((item) => (
              <SearchCard key={item.movie_id} contentId={item.movie_id} contentType={searchType} contentData={item} />
            ))
          : searchType === 'movie' && <NoSearchResults type="movie" />}
      </Stack>

      {/* Pagination Controls at bottom too */}
      {hasResults && (
        <Stack direction="row" alignItems="center" justifyContent="center" gap="16px" sx={{ my: 2 }}>
          <Button variant="outlined" onClick={handlePreviousPage} disabled={currentPage === 1 || searchForm.isSubmitting}>
            Previous
          </Button>
          <span>Page {currentPage}</span>
          <Button variant="outlined" onClick={handleNextPage} disabled={searchForm.isSubmitting}>
            Next
          </Button>
        </Stack>
      )}
    </Box>
  );
}
