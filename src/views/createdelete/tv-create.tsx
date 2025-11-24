'use client';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik, FieldArray, FormikTouched, FormikErrors } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';

// --- Types ---
interface CastMember {
  name: string;
  character: string;
  profileUrl: string;
}

interface ShowFormValues {
  name: string;
  originalName: string;
  firstAirDate: string;
  lastAirDate: string;
  seasons: string;
  episodes: string;
  status: string;
  genres: string;
  overview: string;
  popularity: string;
  tMDbRating: string;
  voteCount: string;
  posterURL: string;
  backdropURL: string;
  creators: string;
  networks: string;
  studios: string;
  cast: CastMember[];
}

export default function ShowCreate() {
  const initialValues: ShowFormValues = {
    name: '',
    originalName: '',
    firstAirDate: '',
    lastAirDate: '',
    seasons: '',
    episodes: '',
    status: '',
    genres: '',
    overview: '',
    popularity: '',
    tMDbRating: '',
    voteCount: '',
    posterURL: '',
    backdropURL: '',
    creators: '',
    networks: '',
    studios: '',
    cast: [{ name: '', character: '', profileUrl: '' }]
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    firstAirDate: Yup.date().required('First air date is required'),
    lastAirDate: Yup.date().required('Last air date is required'),
    seasons: Yup.number().min(0).required('Seasons is required'),
    episodes: Yup.number().min(0).required('Episodes is required'),
    status: Yup.string().required('Status is required'),
    genres: Yup.string().required('At least one genre is required'),
    cast: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Cast member name is required'),
        character: Yup.string().required('Character name is required'),
        profileUrl: Yup.string().url('Must be a valid URL').optional()
      })
    )
  });

  const handleSubmit = async (values: ShowFormValues, { setSubmitting, resetForm }: any) => {
    try {
      const payload = {
        ...values,
        genres: values.genres.split(',').map((g) => g.trim()),
        creators: values.creators.split(',').map((c) => c.trim()),
        networks: values.networks.split(',').map((n) => n.trim()),
        studios: values.studios.split(',').map((s) => s.trim())
      };

      // --- API call ---
      // await fetch('/api/shows', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      openSnackbar({
        open: true,
        message: 'Show successfully created!',
        variant: 'alert',
        alert: { color: 'success' },
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      } as SnackbarProps);

      resetForm();
    } catch (err: any) {
      openSnackbar({
        open: true,
        message: err.message || 'Failed to create show',
        variant: 'alert',
        alert: { color: 'error' },
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      } as SnackbarProps);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
        py: 4,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Stack
        spacing={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          bgcolor: '#fff',
          p: 4,
          borderRadius: 2,
          boxShadow: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h3">Create Show</Typography>
          <Typography color="secondary">Fill in the details below to create a new show.</Typography>
        </Stack>

        <Formik<ShowFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleBlur, handleChange, handleSubmit, isSubmitting }) => {
            const castTouched = touched.cast as FormikTouched<CastMember>[] | undefined;
            const castErrors = errors.cast as FormikErrors<CastMember>[] | undefined;

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  {/* Main fields */}
                  {[
                    { label: 'Name', name: 'name', placeholder: 'e.g. Breaking Bad', type: 'text' },
                    { label: 'Original Name', name: 'originalName', placeholder: 'Optional...', type: 'text' },
                    { label: 'First Air Date', name: 'firstAirDate', type: 'date' },
                    { label: 'Last Air Date', name: 'lastAirDate', type: 'date' },
                    { label: 'Seasons', name: 'seasons', placeholder: 'e.g. 5', type: 'number' },
                    { label: 'Episodes', name: 'episodes', placeholder: 'e.g. 62', type: 'number' },
                    { label: 'Status', name: 'status', placeholder: 'e.g. Ended / Returning', type: 'text' },
                    { label: 'Genres (comma-separated)', name: 'genres', placeholder: 'Drama, Thriller', type: 'text' },
                    { label: 'Overview', name: 'overview', placeholder: 'Brief description...', type: 'text' },
                    { label: 'Popularity', name: 'popularity', placeholder: 'e.g. 123.45', type: 'number' },
                    { label: 'TMDb Rating', name: 'tMDbRating', placeholder: '0–10', type: 'number' },
                    { label: 'Vote Count', name: 'voteCount', placeholder: 'e.g. 14823', type: 'number' },
                    { label: 'Poster URL', name: 'posterURL', placeholder: 'https://...', type: 'text' },
                    { label: 'Backdrop URL', name: 'backdropURL', placeholder: 'https://...', type: 'text' },
                    { label: 'Creators (comma-separated)', name: 'creators', placeholder: 'Vince Gilligan', type: 'text' },
                    { label: 'Networks (comma-separated)', name: 'networks', placeholder: 'AMC, Netflix', type: 'text' },
                    { label: 'Studios (comma-separated)', name: 'studios', placeholder: 'Sony Pictures Television', type: 'text' }
                  ].map((field) => (
                    <Stack key={field.name} spacing={0.5}>
                      <InputLabel htmlFor={`field-${field.name}`}>{field.label}</InputLabel>
                      <OutlinedInput
                        fullWidth
                        id={`field-${field.name}`}
                        name={field.name}
                        type={field.type || 'text'}
                        value={values[field.name as keyof ShowFormValues]}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        error={touched[field.name as keyof ShowFormValues] && Boolean(errors[field.name as keyof ShowFormValues])}
                      />
                      {touched[field.name as keyof ShowFormValues] && errors[field.name as keyof ShowFormValues] && (
                        <FormHelperText error>{errors[field.name as keyof ShowFormValues] as string}</FormHelperText>
                      )}
                    </Stack>
                  ))}

                  {/* Cast FieldArray */}
                  <FieldArray name="cast">
                    {({ push, remove }) => (
                      <Stack spacing={2}>
                        <Typography variant="h6">Cast</Typography>
                        {values.cast.map((member, index) => (
                          <Stack
                            key={index}
                            spacing={2}
                            sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#fafafa' }}
                          >
                            {(['name', 'character', 'profileUrl'] as (keyof CastMember)[]).map((key) => (
                              <Stack key={key} spacing={0.5}>
                                <InputLabel htmlFor={`cast-${index}-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                                <OutlinedInput
                                  fullWidth
                                  id={`cast-${index}-${key}`}
                                  name={`cast.${index}.${key}`}
                                  value={member[key]}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  placeholder={
                                    key === 'name'
                                      ? 'Bryan Cranston'
                                      : key === 'character'
                                      ? 'Walter White'
                                      : 'https://image.tmdb.org/t/p/...jpg'
                                  }
                                  error={castTouched?.[index]?.[key] && Boolean(castErrors?.[index]?.[key])}
                                />
                                {castTouched?.[index]?.[key] && castErrors?.[index]?.[key] && (
                                  <FormHelperText error>{castErrors[index][key]}</FormHelperText>
                                )}
                              </Stack>
                            ))}
                            <Button color="error" onClick={() => remove(index)} disabled={values.cast.length === 1}>
                              Remove
                            </Button>
                          </Stack>
                        ))}
                        <Button variant="outlined" onClick={() => push({ name: '', character: '', profileUrl: '' })}>
                          Add Cast Member
                        </Button>
                      </Stack>
                    )}
                  </FieldArray>

                  <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                    Create Show
                  </Button>
                </Stack>
              </form>
            );
          }}
        </Formik>
      </Stack>
    </Box>
  );
}
