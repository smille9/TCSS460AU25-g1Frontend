'use client'


//material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';


// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

//project imports
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';


export default function ShowDelete() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Stack bgcolor='#fff' spacing={3} sx={{ width: 300, bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 2 }}>
                <Stack spacing={1} sx={{
                }}>
                    <Typography variant="h3"> Delete Show </Typography>
                    <Typography color="secondary">This form is for Deleting a show by ID.</Typography>
                </Stack>

                <Formik
                    initialValues={{ id: '', submit: null }}
                    validationSchema={Yup.object().shape({
                        id: Yup.number()
                            .typeError('ID must be a number')
                            .min(0, 'ID must be >= 0')
                            .required('ID is required'),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        try {
                            console.log(values);

                            // Throw error since APi is not connected
                            throw new Error(
                                'This page is not currently connected to the shows database. If you want to delete a movie, please contact an Admin.'
                            );


                        } catch (err: any) {
                            openSnackbar({
                                open: true,
                                message: err.message,
                                variant: 'alert',
                                alert: { color: 'error' },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' }
                            } as SnackbarProps);
                        } finally {
                            setSubmitting(false);
                            resetForm();
                        }
                    }}
                >
                    {/* Form layout copied from reset password form */}
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Stack spacing={2} >
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="id-field">Shows ID</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        id="id-field"
                                        name="id"
                                        value={values.id}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={touched.id && Boolean(errors.id)}
                                        placeholder="Enter Shows ID"
                                    />
                                    {touched.id && errors.id && <FormHelperText error>{errors.id}</FormHelperText>}
                                </Stack>

                                {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}

                                <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                                    Delete Show
                                </Button>
                            </Stack>
                        </form>
                    )}
                </Formik>
            </Stack>
        </Box>
    );
}

