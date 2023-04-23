export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="md:min-h-screen grid place-content-center">{children}</div>
  );
}
