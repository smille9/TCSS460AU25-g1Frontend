'use client';

import { useState } from 'react';

// material-ui
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

// third-party
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { moviesApi } from 'services/moviesApi';
import FormWrapper from 'components/FormWrapper';

const MAX_ACTORS_AMOUNT: number = 10;

interface Actor {
  name: string;
  character: string;
}

interface MovieFormValues {
  title: string;
  original_title: string;
  release_year: string;
  runtime_minutes: string;
  rating: string | null;
  box_office: string | null;
  budget: string | null;
  director_name: string;
  director_id: string;
  overview: string;
  genres: string;
  studios: string;
  poster_url: string;
  backdrop_url: string;
  collection: string;
  mpa_rating: string;
  actors: Actor[];
}

interface NewDirectorFormValues {
  name: string;
}

export default function MovieCreate() {
  const [openDirectorDialog, setOpenDirectorDialog] = useState(false);
  const [newDirector, setNewDirector] = useState<NewDirectorFormValues>({
    name: ''
  });
  const [isSearchingDirector, setIsSearchingDirector] = useState(false);

  const initialValues: MovieFormValues = {
    title: '',
    original_title: '',
    release_year: '',
    runtime_minutes: '',
    rating: '',
    box_office: '',
    budget: '',
    director_name: '',
    director_id: '',
    overview: '',
    genres: '',
    studios: '',
    poster_url: '',
    backdrop_url: '',
    collection: '',
    mpa_rating: '',
    actors: [{ name: '', character: '' }]
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    original_title: Yup.string(),
    release_year: Yup.number()
      .min(1800, 'Release year must be ≥ 1800')
      .max(new Date().getFullYear() + 1, 'Invalid year')
      .required('Release year is required'),
    runtime_minutes: Yup.number().min(1, 'Runtime must be at least 1 minute').required('Runtime is required'),
    rating: Yup.number().min(0, 'Min 0').max(10, 'Max 10').nullable(),
    box_office: Yup.number().nullable(),
    budget: Yup.number().nullable(),
    director_name: Yup.string().required('Director name is required'),
    director_id: Yup.string().required('Director ID is required'),
    overview: Yup.string(),
    genres: Yup.string()
      .required('At least one genre is required')
      .test('genres-format', 'Genres must be separated by commas', (value) => !!value?.split(',').length),
    studios: Yup.string()
      .required('At least one studio is required')
      .test('studios-format', 'Studios must be separated by commas', (value) => !!value?.split(',').length),
    poster_url: Yup.string().url('Must be a valid URL').nullable(),
    backdrop_url: Yup.string().url('Must be a valid URL').nullable(),
    collection: Yup.string().nullable(),
    mpa_rating: Yup.string().nullable(),
    actors: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        character: Yup.string()
      })
    )
  });

  const handleSubmit = async (values: MovieFormValues, { setSubmitting, resetForm }: any) => {
    try {
      // Convert to match API, note that API does not allow addings actors, so the users inputted actors aren't added to the payload.
      const payload = {
        title: values.title,
        original_title: values.original_title || null,
        release_year: Number(values.release_year),
        runtime_minutes: Number(values.runtime_minutes),
        rating: values.rating !== '' && values.rating !== null ? Number(values.rating) : null,
        box_office: values.box_office !== '' && values.box_office !== null ? Number(values.box_office) : null,
        director_id: Number(values.director_id),
        overview: values.overview || null,
        genres: values.genres
          .split(',')
          .map((g) => g.trim())
          .join(';'),
        budget: values.budget !== '' && values.budget !== null ? Number(values.budget) : null,
        studios: values.studios
          .split(',')
          .map((s) => s.trim())
          .join(';'),
        poster_url: values.poster_url || null,
        backdrop_url: values.backdrop_url || null,
        collection: values.collection || null,
        mpa_rating: values.mpa_rating || null
      };

      await moviesApi.create(payload);

      openSnackbar({
        open: true,
        message: 'Movie successfully created!',
        variant: 'alert',
        alert: { color: 'success' },
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      } as SnackbarProps);

      resetForm();
    } catch (err: any) {
      openSnackbar({
        open: true,
        message: err.message || 'Failed to create movie',
        variant: 'alert',
        alert: { color: 'error' },
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      } as SnackbarProps);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDirector = async (setFieldValue: any) => {
    try {
      // Create the director using the API
      const response = await moviesApi.createDirector(newDirector.name);

      console.log('Create director response:', response);

      // Extract the director ID from the response
      // Check multiple possible structures
      const directorId = response.data?.director_id || response.data?.id || response.data?.data?.director_id || response.data?.data?.id;

      if (!directorId) {
        throw new Error('Director ID not returned from API');
      }

      // Set both the director name and ID in the form
      setFieldValue('director_name', newDirector.name);
      setFieldValue('director_id', directorId.toString());

      openSnackbar({
        open: true,
        message: 'Director added successfully!',
        variant: 'alert',
        alert: { color: 'success' },
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      } as SnackbarProps);

      setOpenDirectorDialog(false);
      setNewDirector({ name: '' });
    } catch (err: any) {
      openSnackbar({
        open: true,
        message: err.message || 'Failed to add director',
        variant: 'alert',
        alert: { color: 'error' },
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      } as SnackbarProps);
    }
  };

  const handleDirectorNameBlur = async (directorName: string, setFieldValue: any) => {
    if (!directorName.trim()) {
      setFieldValue('director_id', '');
      setIsSearchingDirector(false);
      return;
    }

    setIsSearchingDirector(true);

    try {
      // Search for the director by name - API expects 'name' parameter
      const response = await moviesApi.getDirecrtors({ params: { name: directorName, limit: 10 } as any });

      console.log('Director search response:', response);

      // Handle triple-nested data structure: response.data.data.data
      const directors = response.data?.data?.data;

      if (directors && Array.isArray(directors) && directors.length > 0) {
        // Try to find exact match first, then case-insensitive match
        let director = directors.find((d: any) => d.name?.toLowerCase() === directorName.toLowerCase());

        // If no exact match, use the first result
        if (!director) {
          director = directors[0];
        }

        const directorId = director.director_id || director.id;

        if (directorId) {
          setFieldValue('director_id', directorId.toString());
          setFieldValue('director_name', director.name || directorName);

          openSnackbar({
            open: true,
            message: `Director found: ${director.name} (ID: ${directorId})`,
            variant: 'alert',
            alert: { color: 'success' },
            anchorOrigin: { vertical: 'top', horizontal: 'center' }
          } as SnackbarProps);
        } else {
          setFieldValue('director_id', '');
        }
      } else {
        // Director not found, clear the ID
        setFieldValue('director_id', '');
        console.log('No directors found for query:', directorName);
      }
    } catch (err: any) {
      console.error('Error searching for director:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setFieldValue('director_id', '');

      const errorMessage = err.response?.data?.message || err.message || 'Failed to search for director';

      openSnackbar({
        open: true,
        message: `Search error: ${errorMessage}`,
        variant: 'alert',
        alert: { color: 'error' },
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      } as SnackbarProps);
    } finally {
      setIsSearchingDirector(false);
    }
  };

  const fields = [
    { label: 'Title', name: 'title', placeholder: 'e.g. Inception', type: 'text' },
    { label: 'Original Title', name: 'original_title', placeholder: 'Optional', type: 'text' },
    { label: 'Release Year', name: 'release_year', placeholder: 'e.g. 2010', type: 'number' },
    { label: 'Runtime (minutes)', name: 'runtime_minutes', placeholder: 'e.g. 148', type: 'number' },
    { label: 'Rating (0–10)', name: 'rating', placeholder: 'e.g. 8.8', type: 'number' },
    { label: 'Box Office', name: 'box_office', placeholder: 'e.g. 80255756', type: 'number' },
    { label: 'Budget', name: 'budget', placeholder: 'e.g. 160000000', type: 'number' },
    { label: 'Director Name', name: 'director_name', placeholder: 'e.g. Christopher Nolan', type: 'text' },
    { label: 'Overview', name: 'overview', placeholder: 'Brief description...', type: 'text' },
    { label: 'Genres (comma-separated)', name: 'genres', placeholder: 'Action, Sci-Fi', type: 'text' },
    { label: 'Studios (comma-separated)', name: 'studios', placeholder: 'Warner Bros.', type: 'text' },
    { label: 'Poster URL', name: 'poster_url', placeholder: 'https://...', type: 'text' },
    { label: 'Backdrop URL', name: 'backdrop_url', placeholder: 'https://...', type: 'text' },
    {
      label: 'Collection',
      name: 'collection',
      placeholder: 'Optional',
      type: 'text'
    }
  ];

  return (
    <FormWrapper
      title="Create Movie"
      subtitle={'Fill in the details below to create a new movie. \nPlease note that adding actors is currently unsupported.'}
    >
      <Formik<MovieFormValues> initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
          <>
            <form noValidate onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {/* Map regular fields */}
                {fields.map((field) => {
                  const isDirectorField = field.name === 'director_name';

                  return (
                    <Stack key={field.name} spacing={0.5}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <InputLabel htmlFor={`field-${field.name}`}>{field.label}</InputLabel>
                        {isDirectorField && (
                          <Button size="small" startIcon={<AddIcon />} onClick={() => setOpenDirectorDialog(true)} variant="text">
                            Add New Director
                          </Button>
                        )}
                      </Stack>
                      <OutlinedInput
                        fullWidth
                        id={`field-${field.name}`}
                        name={field.name}
                        type={field.type || 'text'}
                        value={values[field.name as keyof MovieFormValues]}
                        onBlur={(e) => {
                          handleBlur(e);
                          if (isDirectorField) {
                            handleDirectorNameBlur(e.target.value, setFieldValue);
                          }
                        }}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        error={touched[field.name as keyof MovieFormValues] && Boolean(errors[field.name as keyof MovieFormValues])}
                      />
                      {isDirectorField && isSearchingDirector && <FormHelperText>Searching for director...</FormHelperText>}
                      {isDirectorField && !isSearchingDirector && values.director_id && (
                        <FormHelperText>Director found (ID: {values.director_id})</FormHelperText>
                      )}
                      {isDirectorField && !isSearchingDirector && touched.director_name && !values.director_id && values.director_name && (
                        <FormHelperText error>Director not found. Please add a new director or check the spelling.</FormHelperText>
                      )}
                      {touched[field.name as keyof MovieFormValues] && errors[field.name as keyof MovieFormValues] && (
                        <FormHelperText error>{errors[field.name as keyof MovieFormValues]?.toString()}</FormHelperText>
                      )}
                    </Stack>
                  );
                })}

                {/* MPA Rating Dropdown */}
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="field-mpa_rating">MPA Rating</InputLabel>
                  <FormControl fullWidth error={touched.mpa_rating && Boolean(errors.mpa_rating)}>
                    <Select
                      id="field-mpa_rating"
                      name="mpa_rating"
                      value={values.mpa_rating || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>

                      <MenuItem value="PG">PG</MenuItem>
                      <MenuItem value="G">G</MenuItem>
                      <MenuItem value="PG-13">PG-13</MenuItem>
                      <MenuItem value="15+">15+</MenuItem>
                      <MenuItem value="16">16</MenuItem>
                      <MenuItem value="R">R</MenuItem>
                      <MenuItem value="14">14</MenuItem>
                      <MenuItem value="NR">NR</MenuItem>
                      <MenuItem value="6">6</MenuItem>
                      <MenuItem value="12">12</MenuItem>
                      <MenuItem value="18">18</MenuItem>
                      <MenuItem value="M">M</MenuItem>
                    </Select>
                    {touched.mpa_rating && errors.mpa_rating && <FormHelperText>{errors.mpa_rating?.toString()}</FormHelperText>}
                  </FormControl>
                </Stack>

                {/* Actors FieldArray */}
                <FieldArray name="actors">
                  {({ push, remove }) => (
                    <Stack spacing={2}>
                      <Typography variant="h6">Actors</Typography>

                      {values.actors.map((actor, index) => {
                        // Safe narrowed versions of touched + errors
                        const actorTouched = touched.actors && touched.actors[index];
                        const actorError = errors.actors && errors.actors[index];
                        const isLast = index === values.actors.length - 1;
                        const canAddMore = values.actors.length < MAX_ACTORS_AMOUNT;

                        return (
                          <Stack
                            key={index}
                            spacing={2}
                            sx={{
                              p: 2,
                              border: '1px solid #ddd',
                              borderRadius: 2,
                              backgroundColor: '#262626'
                            }}
                          >
                            {(['name', 'character'] as const).map((key) => (
                              <Stack key={key} spacing={0.5}>
                                <InputLabel htmlFor={`actors-${index}-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>

                                <OutlinedInput
                                  fullWidth
                                  id={`actors-${index}-${key}`}
                                  name={`actors.${index}.${key}`}
                                  value={actor[key]}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder={key === 'name' ? 'Robert Downey Jr.' : 'Tony Stark'}
                                  error={
                                    !!(actorTouched && actorTouched[key] && actorError && typeof actorError !== 'string' && actorError[key])
                                  }
                                />

                                {actorTouched && actorTouched[key] && actorError && typeof actorError !== 'string' && actorError[key] && (
                                  <FormHelperText error>{actorError[key]}</FormHelperText>
                                )}
                              </Stack>
                            ))}

                            <Stack direction="column" alignItems="center" justifyContent="center">
                              <IconButton color="error" onClick={() => remove(index)} disabled={values.actors.length === 1}>
                                <DeleteIcon />
                              </IconButton>

                              {isLast && (
                                <Button
                                  startIcon={<AddIcon />}
                                  variant="outlined"
                                  size="medium"
                                  disabled={!canAddMore}
                                  onClick={() => push({ name: '', character: '' })}
                                >
                                  Add Actor
                                </Button>
                              )}
                            </Stack>
                          </Stack>
                        );
                      })}
                    </Stack>
                  )}
                </FieldArray>

                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                  Create Movie
                </Button>
              </Stack>
            </form>

            {/* Add Director Dialog */}
            <Dialog open={openDirectorDialog} onClose={() => setOpenDirectorDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Add New Director</DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <Stack spacing={0.5}>
                    <InputLabel htmlFor="new-director-name">Director Name *</InputLabel>
                    <OutlinedInput
                      fullWidth
                      id="new-director-name"
                      value={newDirector.name}
                      onChange={(e) => setNewDirector({ name: e.target.value })}
                      placeholder="e.g. Christopher Nolan"
                    />
                  </Stack>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDirectorDialog(false)}>Cancel</Button>
                <Button onClick={() => handleAddDirector(setFieldValue)} variant="contained" disabled={!newDirector.name.trim()}>
                  Add Director
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Formik>
    </FormWrapper>
  );
}
