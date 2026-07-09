'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { CONTACT, CLOSING_CTA } from './home-data';

// ----------------------------------------------------------------------

type HomeCtaProps = {
  waLink?: string | null;
};

export function HomeCta({ waLink }: HomeCtaProps) {
  return (
    <Box
      component="section"
      sx={(theme) => ({
        overflow: 'hidden',
        color: 'common.white',
        background: `linear-gradient(120deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.main} 55%, ${theme.vars.palette.primary.dark})`,
      })}
    >
      <Container>
        <Box
          sx={{
            gap: { xs: 3, md: 6 },
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >


          <MotionViewport sx={{ flex: 1, py: { xs: 0, md: 8 }, pb: { xs: 6, md: 8 } }}>
            <Typography
              component={m.h2}
              variants={varFade('inUp')}
              variant="h2"
              sx={{ mb: 3, fontStyle: 'italic' }}
            >
              {CLOSING_CTA.title}
            </Typography>

            <Typography
              component={m.p}
              variants={varFade('inUp')}
              sx={{ mb: 4, maxWidth: 640, mx: 'auto', opacity: 0.9 }}
            >
              {CLOSING_CTA.description}{' '}
              <Box component="span" sx={{ fontWeight: 'fontWeightBold' }}>
                {CLOSING_CTA.descriptionStrong}
              </Box>
              . {CLOSING_CTA.descriptionEnd}
            </Typography>

            <Box component={m.div} variants={varFade('inUp')}>
              <Button
                size="large"
                variant="contained"
                href={waLink ?? CONTACT.wa}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<Iconify icon="solar:chat-round-call-linear" />}
                sx={{
                  color: 'primary.dark',
                  bgcolor: 'common.white',
                  '&:hover': { bgcolor: 'grey.200' },
                }}
              >
                {CLOSING_CTA.cta}
              </Button>
            </Box>
          </MotionViewport>
        </Box>
      </Container>
    </Box>
  );
}
