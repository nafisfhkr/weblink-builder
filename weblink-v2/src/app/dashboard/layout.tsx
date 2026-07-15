import { MainLayout } from 'src/layouts/main';
import LogoutButton from 'src/components/dashboard/LogoutButton';
import Box from '@mui/material/Box';
import { paths } from 'src/routes/paths';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const dashboardNavData = [
    { title: 'Projects', path: paths.dashboard },
    { title: 'Settings', path: paths.settings },
  ];

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
        nav: {
          data: dashboardNavData
        }
      }}
    >
      <div>
        {children}
      </div>
    </MainLayout>
  );
}
