'use client';

import { useState, useEffect } from 'react';
import { tvApi } from 'services/tvApi';
import { Box } from '@mui/material';
import SearchCard from 'components/SearchCard/SearchCard';
import { IMovie } from 'types/movies';
import { IShow } from 'types/tv';

export default function SearchPage() {
  const [searchData, setSearchData] = useState<IMovie[] | IShow[]>([]);

  useEffect(() => {
    tvApi
      .getAll()
      .then((response) => {
        setSearchData(response);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Box>
      <Box>
        {(searchData as IShow[]).map((item) => (
          <SearchCard key={item.iD} contentId={item.iD} contentType="tv" contentData={item} />
        ))}
      </Box>
    </Box>
  );
}
