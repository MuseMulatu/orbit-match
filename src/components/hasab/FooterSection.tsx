export function FooterSection() {
  return (
    <footer className="py-12 px-6 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <p className="text-white/60 font-bold text-lg">Hasab</p>
        <p className="text-white/30 text-sm">
          Privacy-first. Mutual-only. No games.
        </p>
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Hasab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
