export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen w-full bg-transparent">
      {children}
    </div>
  );
}
