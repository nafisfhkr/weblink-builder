import { MainLayout } from 'src/layouts/main';
import LogoutButton from 'src/components/dashboard/LogoutButton';
import Box from '@mui/material/Box';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <MainLayout
      slotProps={{
        header: {
          sx: { position: { md: 'fixed' } },
          slotProps: { container: { maxWidth: false } },
          slots: {
            rightArea: (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LogoutButton />
              </Box>
            )
          }
        },
      }}
    >
      <div>
        {children}
      </div>
    </MainLayout>
  );
}
