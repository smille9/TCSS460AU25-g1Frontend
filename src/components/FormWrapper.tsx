'use client';

import React from 'react';

// material-ui imports
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface FormWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function FormWrapper({ title, subtitle, children }: FormWrapperProps) {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
        py: 4,
        backgroundColor: '#f5f5f5',
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
          overflowY: 'auto',
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h3">{title}</Typography>
          {subtitle && <Typography color="secondary" sx = {{ whiteSpace: 'pre-line'}}>{subtitle}</Typography>}
        </Stack>

        {children}
      </Stack>
    </Box>
  );
}
