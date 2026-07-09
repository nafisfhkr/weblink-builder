'use client';

import { Fragment } from 'react';
import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { AnimateCountUp } from 'src/components/animate';

import { HERO, asset, CONTACT } from './home-data';

// Above-the-fold = LCP: no entry animations here — SSR HTML must ship the
// heading and the <img> fully visible (crawlers + LCP can't wait for JS).

// ----------------------------------------------------------------------

type HomeHeroProps = {
  waLink?: string | null;
};

export function HomeHero({ waLink }: HomeHeroProps) {
  return (
    <Box
      component="section"
      sx={(theme) => ({
        overflow: 'hidden',
        position: 'relative',
        py: { xs: 6, md: 8 },
        background: `linear-gradient(180deg, ${varAlpha(theme.vars.palette.primary.lighterChannel, 0.4)}, ${varAlpha(theme.vars.palette.primary.lighterChannel, 0)})`,
      })}
    >
      <Container>
        <Box
          sx={{
            gap: { xs: 5, md: 8 },
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                mb: 3,
                borderRadius: 1,
                typography: 'subtitle2',
                color: 'primary.dark',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                bgcolor: 'primary.lighter',
              }}
            >
              <Iconify width={18} icon="solar:check-circle-bold" />
              {HERO.badge}
            </Box>

            <Typography component="h1" variant="h1" sx={{ mb: 3 }}>
              {HERO.title}
            </Typography>

            <Typography sx={{ mb: 4, maxWidth: 520, color: 'text.secondary' }}>
              {HERO.description}
            </Typography>

            <Box sx={{ mb: 5 }}>
              <Button
                size="large"
                color="primary"
                variant="contained"
                href="/dashboard"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              >
                {HERO.cta}
              </Button>
            </Box>


          </Box>

          <Box sx={{ flex: 1, width: 1 }}>
            <Box
              sx={{
                width: 1,
                aspectRatio: { xs: '1/1', md: '4/3' },
                bgcolor: '#121212',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: (theme) => theme.customShadows.z24,
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            >
              {/* Glowing Gradient Background */}
              <Box
                sx={{
                  position: 'absolute',
                  width: { xs: 200, md: 300 },
                  height: { xs: 200, md: 300 },
                  bgcolor: 'rgba(0, 184, 217, 0.15)',
                  filter: 'blur(80px)',
                  borderRadius: '50%',
                  zIndex: 0,
                }}
              />

              {/* Central Circle */}
              <Box
                component={m.div}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                  width: { xs: 120, md: 180 },
                  height: { xs: 120, md: 180 },
                  borderRadius: '50%',
                  bgcolor: '#00B8D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 20px 40px rgba(0, 184, 217, 0.3)',
                  zIndex: 2,
                }}
              >
                <Iconify icon={"solar:megaphone-bold" as any} width={80} sx={{ color: 'common.white', display: { xs: 'none', md: 'block' } }} />
                <Iconify icon={"solar:megaphone-bold" as any} width={56} sx={{ color: 'common.white', display: { xs: 'block', md: 'none' } }} />
              </Box>

              {/* Floating Icon 1 (Link) */}
              <Box
                component={m.div}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                sx={{
                  position: 'absolute',
                  top: '20%',
                  left: '15%',
                  width: { xs: 40, md: 56 },
                  height: { xs: 40, md: 56 },
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Iconify icon={"solar:link-bold" as any} width={24} sx={{ color: '#00B8D9' }} />
              </Box>

              {/* Floating Icon 2 (Image) */}
              <Box
                component={m.div}
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                sx={{
                  position: 'absolute',
                  bottom: '25%',
                  right: '15%',
                  width: { xs: 48, md: 64 },
                  height: { xs: 48, md: 64 },
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Iconify icon={"solar:gallery-bold" as any} width={28} sx={{ color: '#FF5630' }} />
              </Box>

              {/* Floating Icon 3 (Heart) */}
              <Box
                component={m.div}
                animate={{ y: [-12, 12, -12] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                sx={{
                  position: 'absolute',
                  top: '25%',
                  right: '25%',
                  width: { xs: 36, md: 48 },
                  height: { xs: 36, md: 48 },
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Iconify icon="solar:heart-bold" width={20} sx={{ color: '#B76E00' }} />
              </Box>

              {/* Floating Icon 4 (Sparkle) */}
              <Box
                component={m.div}
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                sx={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '25%',
                  width: { xs: 36, md: 48 },
                  height: { xs: 36, md: 48 },
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Iconify icon={"solar:stars-bold" as any} width={20} sx={{ color: '#FFAB00' }} />
              </Box>
            </Box>

            <Box
              sx={{
                mt: 4,
                gap: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {HERO.stats.map((stat, index) => (
                <Fragment key={stat.label}>
                  {index > 0 && (
                    <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: 'divider' }} />
                  )}
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'center',
                      }}
                    >
                      <AnimateCountUp to={stat.value} sx={{ typography: 'h2' }} />
                      <Typography component="span" variant="h3">
                        {stat.suffix}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Fragment>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
