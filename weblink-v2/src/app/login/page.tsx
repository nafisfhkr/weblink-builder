"use client"

import { signIn } from "next-auth/react"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { SimpleLayout } from 'src/layouts/simple';
import { Iconify } from 'src/components/iconify';

export default function LoginPage() {
  return (
    <SimpleLayout slotProps={{ content: { compact: true } }}>
      <Stack spacing={3} sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Welcome Back</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Sign in to start building your Weblink digital identity.
        </Typography>
      </Stack>

      <Button
        fullWidth
        size="large"
        variant="outlined"
        color="inherit"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        startIcon={<Iconify icon="socials:google" />}
        sx={{
          borderColor: 'divider',
          fontWeight: 'fontWeightMedium',
          fontSize: '1rem',
          py: 1.5
        }}
      >
        Continue with Google
      </Button>
    </SimpleLayout>
  )
}
