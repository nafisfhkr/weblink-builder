import { MainLayout } from 'src/layouts/main';
import LogoutButton from 'src/components/dashboard/LogoutButton';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Settings } from 'lucide-react';

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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-2xs"
                >
                  <Settings size={14} />
                  Settings
                </Link>
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
