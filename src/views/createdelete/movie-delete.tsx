'use client';

//material-ui
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

//project imports
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import FormWrapper from 'components/FormWrapper';

export default function MovieDelete() {
  return (
    <FormWrapper title="Delete Movie" subtitle="This form is for deleting a movie by ID">
      <Formik
        initialValues={{ id: '', submit: null }}
        validationSchema={Yup.object().shape({
          id: Yup.number().typeError('ID must be a number').min(0, 'ID must be >= 0').required('ID is required')
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          try {
            console.log(values);

            // Throw error since APi is not connected
            throw new Error(
              'This page is not currently connected to the movies database. If you want to delete a movie, please contact an Admin.'
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
            <Stack spacing={2}>
              <Stack spacing={1}>
                <InputLabel htmlFor="id-field">Movie ID</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="id-field"
                  name="id"
                  value={values.id}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.id && Boolean(errors.id)}
                  placeholder="Enter movie ID"
                />
                {touched.id && errors.id && <FormHelperText error>{errors.id}</FormHelperText>}
              </Stack>

              {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}

              <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                Delete Movie
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </FormWrapper>
  );
}
