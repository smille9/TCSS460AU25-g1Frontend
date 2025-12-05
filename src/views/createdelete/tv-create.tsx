'use client';

// material-ui
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

// third-party
import * as Yup from 'yup';
import { Formik, FieldArray, FormikTouched, FormikErrors } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { tvApi } from 'services/tvApi';
import { sanitizeCommaSeparated } from 'utils/formHelpers';
import FormWrapper from 'components/FormWrapper';

const MAX_CAST_LENGTH: number = 10;

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
    originalName: Yup.string().optional(),

    firstAirDate: Yup.date().required('First air date is required'),

    lastAirDate: Yup.date()
      .required('Last air date is required')
      .min(Yup.ref('firstAirDate'), 'Last air date cannot be before first air date'),

    seasons: Yup.number().min(0, 'Seasons cannot be negative').required('Seasons is required'),
    episodes: Yup.number().min(0, 'Episodes cannot be negative').required('Episodes is required'),

    status: Yup.string()
      .trim()
      .oneOf(['Returning Series', 'Ended', 'Canceled'], 'Status must be one of: Returning Series, Ended, Canceled')
      .required('Status is required'),

    genres: Yup.string().required('At least one genre is required'),

    overview: Yup.string().optional(),

    popularity: Yup.number().min(0, 'Popularity cannot be negative').required('Popularity is required'),

    tMDbRating: Yup.number().min(0, 'Rating cannot be less than 0').max(10, 'Rating cannot be more than 10').required('Rating is required'),

    voteCount: Yup.number().min(0, 'Vote count cannot be negative').required('Vote count is required'),

    posterURL: Yup.string().url('Poster must be a valid URL').optional(),
    backdropURL: Yup.string().url('Backdrop must be a valid URL').optional(),

    creators: Yup.string().required('Creators is required'),

    networks: Yup.string().required('Networks is required'),

    studios: Yup.string().required('Studios is required'),

    cast: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Cast name is required'),
        character: Yup.string().required('Character is required'),
        profileUrl: Yup.string().url('Profile URL must be valid').optional()
      })
    )
  });

  const handleSubmit = async (values: ShowFormValues, { setSubmitting, resetForm }: any) => {
    try {
      const payload = {
        name: values.name,
        originalName: values.originalName,
        firstAirDate: values.firstAirDate,
        lastAirDate: values.lastAirDate,
        seasons: Number(values.seasons),
        episodes: Number(values.episodes),
        status: values.status,
        genres: sanitizeCommaSeparated(values.genres),
        overview: values.overview,
        popularity: Number(values.popularity),
        tMDbRating: Number(values.tMDbRating),
        voteCount: Number(values.voteCount),
        posterURL: values.posterURL,
        backdropURL: values.backdropURL,
        creators: sanitizeCommaSeparated(values.creators),
        networks: sanitizeCommaSeparated(values.networks),
        studios: sanitizeCommaSeparated(values.studios),
        cast: values.cast.map((c) => ({
          name: c.name,
          character: c.character,
          profileUrl: c.profileUrl
        }))
      };

      await tvApi.create(payload);

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
    <FormWrapper title="Create Show" subtitle="Fill in the details below to create a new show.">
      <Formik<ShowFormValues> initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting }) => {
          const castTouched = touched.cast as FormikTouched<CastMember>[] | undefined;
          const castErrors = errors.cast as FormikErrors<CastMember>[] | undefined;

          //Custom change handler for mui Select component since it was behaving weirdly.
          const handleStatusChange = (event: SelectChangeEvent) => {
            setFieldValue('status', event.target.value);
          };

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
                      <FormHelperText error>{errors[field.name as keyof ShowFormValues]?.toString()}</FormHelperText>
                    )}
                  </Stack>
                ))}

                {/* Status Dropdown */}
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="field-status">Status</InputLabel>
                  <FormControl fullWidth error={touched.status && Boolean(errors.status)}>
                    <Select
                      id="field-status"
                      name="status"
                      value={values.status || ''}
                      onBlur={handleBlur}
                      onChange={handleStatusChange}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Returning Series">Returning Series</MenuItem>
                      <MenuItem value="Ended">Ended</MenuItem>
                      {/*TODO:Waiting on bug report for this to be re-added. There are entries with this status in the DB but it fails to post if you try with this status*/}
                      {/* <MenuItem value="Canceled">Canceled</MenuItem>*/}
                    </Select>
                    {touched.status && errors.status && <FormHelperText>{errors.status?.toString()}</FormHelperText>}
                  </FormControl>
                </Stack>

                {/* Cast FieldArray */}
                <FieldArray name="cast">
                  {({ push, remove }) => (
                    <Stack spacing={2}>
                      <Typography variant="h6">Cast</Typography>
                      {values.cast.map((member, index) => {
                        const isLast = index === values.cast.length - 1;
                        const canAddMore = values.cast.length < MAX_CAST_LENGTH;

                        return (
                          <Stack
                            key={index}
                            spacing={2}
                            sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#262626' }}
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
                            <Stack direction="column" alignItems="center" justifyContent="center">
                              <IconButton color="error" onClick={() => remove(index)} disabled={values.cast.length === 1}>
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
                                  Add Cast Member
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
                  Create Show
                </Button>
              </Stack>
            </form>
          );
        }}
      </Formik>
    </FormWrapper>
  );
}
