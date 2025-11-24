'use client';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// third-party
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { moviesApi } from 'services/moviesApi';

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
    director_id: string;
    country_id: string;
    overview: string;
    genres: string;
    studios: string;
    poster_url: string;
    backdrop_url: string;
    collection: string;
    mpa_rating: string;
    actors: Actor[];
}

export default function MovieCreate() {
    const initialValues: MovieFormValues = {
        title: '',
        original_title: '',
        release_year: '',
        runtime_minutes: '',
        rating: '',
        box_office: '',
        budget: '',
        director_id: '',
        country_id: '',
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
        runtime_minutes: Yup.number()
            .min(1, 'Runtime must be at least 1 minute')
            .required('Runtime is required'),
        rating: Yup.number().min(0, 'Min 0').max(10, 'Max 10').nullable(),
        box_office: Yup.number().nullable(),
        budget: Yup.number().nullable(),
        director_id: Yup.number().min(1, 'Director ID must be > 0').required('Director is required'),
        country_id: Yup.number().min(1, 'Country ID must be > 0').required('Country is required'),
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
            // Convert to match api, note that API does not specify requiring actors, so the users inputted actors are omitted.
            const payload = {
                title: values.title,
                original_title: values.original_title || null,
                release_year: Number(values.release_year),
                runtime_minutes: Number(values.runtime_minutes),
                rating: values.rating !== '' && values.rating !== null ? Number(values.rating) : null,
                box_office: values.box_office !== '' && values.box_office !== null ? Number(values.box_office) : null,
                director_id: Number(values.director_id),
                country_id: Number(values.country_id),
                overview: values.overview || null,
                genres: values.genres.split(',').map(g => g.trim()).join(';'),
                budget: values.budget !== '' && values.budget !== null ? Number(values.budget) : null,
                studios: values.studios.split(',').map(s => s.trim()).join(';'),
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

    const fields = [
        { label: 'Title', name: 'title', placeholder: 'e.g. Inception' },
        { label: 'Original Title', name: 'original_title', placeholder: 'Optional' },
        { label: 'Release Year', name: 'release_year', placeholder: 'e.g. 2010', type: 'number' },
        { label: 'Runtime (minutes)', name: 'runtime_minutes', placeholder: 'e.g. 148', type: 'number' },
        { label: 'Rating (0–10)', name: 'rating', placeholder: 'e.g. 8.8', type: 'number' },
        { label: 'Box Office', name: 'box_office', placeholder: 'e.g. 80255756', type: 'number' },
        { label: 'Budget', name: 'budget', placeholder: 'e.g. 160000000', type: 'number' },
        { label: 'Director ID', name: 'director_id', placeholder: 'e.g. 12', type: 'number' },
        { label: 'Country ID', name: 'country_id', placeholder: 'e.g. 1', type: 'number' },
        { label: 'Overview', name: 'overview', placeholder: 'Brief description...' },
        { label: 'Genres (comma-separated)', name: 'genres', placeholder: 'Action, Sci-Fi' },
        { label: 'Studios (comma-separated)', name: 'studios', placeholder: 'Warner Bros.' },
        { label: 'Poster URL', name: 'poster_url', placeholder: 'https://...' },
        { label: 'Backdrop URL', name: 'backdrop_url', placeholder: 'https://...' },
        { label: 'Collection', name: 'collection', placeholder: 'Optional' }
    ];

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
                    maxWidth: 700,
                    bgcolor: '#fff',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
            >
                <Stack spacing={1}>
                    <Typography variant="h3">Create Movie</Typography>
                    <Typography color="secondary">Fill in the details below to create a new movie.</Typography>
                </Stack>

                <Formik<MovieFormValues> initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ values, touched, errors, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                {/* Map regular fields */}
                                {fields.map((field) => (
                                    <Stack key={field.name} spacing={0.5}>
                                        <InputLabel htmlFor={`field-${field.name}`}>{field.label}</InputLabel>
                                        <OutlinedInput
                                            type={field.type || 'text'}
                                            value={values[field.name as keyof MovieFormValues]}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            error={touched[field.name as keyof MovieFormValues] && Boolean(errors[field.name as keyof MovieFormValues])}
                                            onWheel={field.type === 'number' ? (e) => e.currentTarget.blur() : undefined}
                                            sx={field.type === 'number' ? {
                                                '& input[type=number]': {
                                                    MozAppearance: 'textfield',
                                                },
                                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                                    WebkitAppearance: 'none',
                                                    margin: 0,
                                                },
                                            } : undefined}
                                        />
                                        {touched[field.name as keyof MovieFormValues] && errors[field.name as keyof MovieFormValues] && (
                                            <FormHelperText error>
                                                {errors[field.name as keyof MovieFormValues]?.toString()}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                ))}

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
                                        {touched.mpa_rating && errors.mpa_rating && (
                                            <FormHelperText>{errors.mpa_rating?.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>

                                {/* Actors FieldArray */}
                                <FieldArray name="actors">
                                    {({ push, remove }) => (
                                        <Stack spacing={2}>
                                            <Typography variant="subtitle1">Actors</Typography>
                                            {values.actors.map((actor, index) => (
                                                <Stack key={index} spacing={1}>
                                                    <Typography variant="subtitle2">Actor {index + 1}</Typography>
                                                    <Box display="flex" gap={2} alignItems="center">
                                                        <OutlinedInput
                                                            fullWidth
                                                            name={`actors[${index}].name`}
                                                            value={actor.name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="Actor Name"
                                                        />
                                                        <OutlinedInput
                                                            fullWidth
                                                            name={`actors[${index}].character`}
                                                            value={actor.character}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="Character Name"
                                                        />
                                                        <IconButton color="error" onClick={() => remove(index)}>
                                                            <RemoveCircleOutlineIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Stack>
                                            ))}
                                            <Button startIcon={<AddCircleOutlineIcon />} onClick={() => push({ name: '', character: '' })}>
                                                Add Actor
                                            </Button>
                                        </Stack>
                                    )}
                                </FieldArray>

                                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                                    Create Movie
                                </Button>
                            </Stack>
                        </form>
                    )}
                </Formik>
            </Stack>
        </Box>
    );
}
