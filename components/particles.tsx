const Particles = () => (
  <div className='pointer-events-none fixed inset-0 overflow-hidden'>
    <div className='absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl' />
    <div className='absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-accent/5 blur-3xl' />
    <div className='absolute -left-20 top-2/3 h-48 w-48 rounded-full bg-accent/3 blur-2xl' />
    <div className='absolute -right-24 top-3/4 h-56 w-56 rounded-full bg-accent/3 blur-2xl' />
    <div className='absolute -left-40 top-[10%] h-72 w-72 rounded-full bg-foreground/2 blur-3xl' />
    <div className='absolute -right-40 top-[60%] h-72 w-72 rounded-full bg-foreground/2 blur-3xl' />
  </div>
);

export default Particles;
