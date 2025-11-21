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
        <SearchCard
          title="Star Wars"
          year={1977}
          genres="Adventure, Action, Science Fiction"
          parental="PG"
          runtime={121}
          director="George Lucas"
          posterImg="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg"
          imgAltText="Poster"
          contentId={1}
          contentType="movie"
        />

        {(searchData as IShow[]).map(item => 
          <SearchCard
            key={item.iD}
            title={item.name}
            year={1900}
            genres={item.genres.join(', ')}
            parental=""
            runtime={0}
            director=""
            posterImg={item.posterURL}
            imgAltText={`Poster of ${item.name}`}
            contentId={item.iD}
            contentType="tv"
          />
        )}
      </Box>
    </Box>
  );
}
