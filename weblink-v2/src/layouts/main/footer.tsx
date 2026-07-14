import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type FooterProps = BoxProps;

export function Footer({ sx, ...other }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={[{ py: 1.5, bgcolor: 'grey.900' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'common.white' }}>
          Venturo Pro © 2026 - The Biggest Programmer Resource in Malang, Jawa Timur
        </Typography>
      </Container>
    </Box>
  );
}
