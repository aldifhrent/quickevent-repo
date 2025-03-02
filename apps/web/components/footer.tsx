export default function Footer() {
  return (
    <footer
      className="flex h-16 flex-col items-center justify-center bg-black p-2 text-white
    "
    >
      <div className="flex  items-center justify-between gap-2 md:gap-12 text-nowrap">
        <p>© QuickEvent Inc.</p>
        <p>Help Center</p>
        <p>Terms</p>
        <p>Privacy Policy</p>
      </div>
    </footer>
  );
}
