'use client';

import { useState, useEffect } from 'react';
import { tvApi } from 'services/tvApi';
import { moviesApi } from 'services/moviesApi';
import { Box, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SearchCard from 'components/SearchCard/SearchCard';
import { IMovie } from 'types/movies';
import { IShow } from 'types/tv';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function SearchView() {
  const [searchMovieData, setSearchMovieData] = useState<IMovie[]>([]);
  const [searchShowData, setSearchShowData] = useState<IShow[]>([]);
  const [searchType, setSearchType] = useState<'movie' | 'tv'>('tv');

  useEffect(() => {
    tvApi
      .getAll()
      .then((response) => {
        setSearchShowData(response);
      })
      .catch((error) => console.error(error));
    moviesApi
      .getAll()
      .then((response) => {
        setSearchMovieData(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newCategory: 'movie' | 'tv') => setSearchType(newCategory);

  const searchForm = useFormik({
    initialValues: {search: ''},
    validationSchema: Yup.object({
      search: Yup.string().required('Search field is required')
    }),
    onSubmit: async(values, {setSubmitting}) => {
      return;
    }
  });

  return (
    <Box>
      <Stack direction="row" gap="16px">
        {/* Search */}
        <form onSubmit={searchForm.handleSubmit}>
          <input type="text" id="search" {...searchForm.getFieldProps('search')} />
          <button type="submit" disabled={searchForm.isSubmitting}>Search</button>
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
        {searchShowData.length &&
          searchType === 'tv' &&
          searchShowData.map((item) => <SearchCard key={item.iD} contentId={item.iD} contentType={searchType} contentData={item} />)}

        {searchMovieData.length &&
          searchType === 'movie' &&
          searchMovieData.map((item) => (
            <SearchCard key={item.movie_id} contentId={item.movie_id} contentType={searchType} contentData={item} />
          ))}
      </Stack>
    </Box>
  );
}
