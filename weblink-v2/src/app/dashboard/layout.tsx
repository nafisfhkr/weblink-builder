import { MainLayout } from 'src/layouts/main';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <MainLayout
      slotProps={{
        header: {
          sx: { position: { md: 'fixed' } },
        },
      }}
    >
      <div className="pt-20">
        {children}
      </div>
    </MainLayout>
  );
}
