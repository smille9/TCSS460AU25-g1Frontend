'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { tvApi } from 'services/tvApi';
//import { moviesApi } from 'services/moviesApi';
import { Box, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SearchCard from 'components/SearchCard/SearchCard';
import NoSearchResults from 'components/SearchCard/NoSearchResults';
import { IMovie } from 'types/movies';
import { IShow } from 'types/tv';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { moviesApi } from 'services/moviesApi';
import { FilterType, IFilterMethodParams, filterMethods } from './filterMethods';

export default function SearchView() {
  const [searchMovieData, setSearchMovieData] = useState<IMovie[]>([]);
  const [searchShowData, setSearchShowData] = useState<IShow[]>([]);
  const [searchType, setSearchType] = useState<FilterType>('tv');
  const [filterOptions, setFilterOptions] = useState<IFilterMethodParams[]>(filterMethods.tv);
  const queryParams = useSearchParams();

  // useEffect(() => {
  //   tvApi
  //     .getAll()
  //     .then((response) => {
  //       setSearchShowData(response);
  //     })
  //     .catch((error) => console.error(error));
  //   moviesApi
  //     .getAll()
  //     .then((response) => {
  //       setSearchMovieData(response.data.data);
  //     })
  //     .catch((error) => console.error(error));
  // }, []);

  useEffect(() => {
    const title = queryParams.get('title');

    if (title) {
      tvApi.search({ params: { name: title } }).then((response) => {
        setSearchShowData(response.data.data);
      });
    }
    setSearchMovieData([]);
  }, [queryParams]);

  const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newCategory: 'movie' | 'tv') => {
    setSearchType(newCategory);
    //setFilterOptions((filterMethods.filter((item) => item.api === newCategory)).params);
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
    onSubmit: (values, { setErrors, setSubmitting }) => {
      switch (values.searchBy) {
        case 'title':
          tvApi.search({ params: { name: values.search } }).then((response: any) => {
            if (response?.error) {
              setErrors({ search: response.error });
              setSubmitting(false);
            } else {
              setSearchShowData(response.data.data);
              setSubmitting(false);
            }
          });
          moviesApi.search({ params: { q: values.search } }).then((response: any) => {
            if (response?.error) {
              setErrors({ search: response.error });
              setSubmitting(false);
            } else {
              setSearchMovieData(response.data.data.data);
              setSubmitting(false);
            }
          });
          break;
        case 'actor':
          tvApi.search({ params: { castMember: values.search } }).then((response: any) => {
            if (response?.error) {
              setErrors({ search: response.error });
              setSubmitting(false);
            } else {
              setSearchShowData(response.data.data);
              setSubmitting(false);
            }
          });
          moviesApi.searchByFilter({ params: { actor: values.search } }).then((response: any) => {
            if (response?.error) {
              setErrors({ search: response.error });
              setSubmitting(false);
            } else {
              setSearchMovieData(response.data.data.data);
              setSubmitting(false);
            }
          });
          break;
        default:
          setErrors({ searchBy: 'Improper search-by filter' });
          setSubmitting(false);
      }
    }
  });

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
          {/*
          <select id="searchBy" {...searchForm.getFieldProps('searchBy')}>
            <option value="title">Title</option>
            <option value="actor">Actor</option>
          </select>*/}

          <select id="searchBy" {...searchForm.getFieldProps('searchBy')}>
            {filterOptions
              .filter((item) => item.type === 'text')
              .map((opt) => (
                <option key={searchType + opt.param} value={opt.param}>
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
    </Box>
  );
}
