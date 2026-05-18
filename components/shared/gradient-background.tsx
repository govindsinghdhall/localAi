export function GradientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute -right-40 top-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
      <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-fuchsia-600/10 blur-[90px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#09090b] to-black" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}
