import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Skin Analysis",
    description: "Advanced AI technology analyzes your skin condition quickly and consistently.",
  },
  {
    title: "Personalized Care",
    description: "Get recommendations based on your predicted condition and confidence score.",
  },
  {
    title: "Track Progress",
    description: "Use repeated uploads to monitor how your skin responds over time.",
  },
  {
    title: "Secure and Private",
    description: "Your uploaded images are processed for analysis and not exposed publicly.",
  },
];

export function HomePage() {
  return (
    <div className='space-y-10'>
      <section className='rounded-3xl bg-white/80 p-8 text-center shadow-sm backdrop-blur md:p-12'>
        <h1 className='mb-3 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl'>
          Your Skin Health Companion
        </h1>
        <p className='mx-auto mb-6 max-w-3xl text-base text-slate-600 md:text-lg'>
          Experience AI-powered skin analysis and get practical guidance for healthier, glowing skin.
        </p>
        <Link
          to='/skin-detection'
          className='inline-flex rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-rose-600'
        >
          Get Started
        </Link>
      </section>

      <section className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
        {features.map((feature) => (
          <article key={feature.title} className='rounded-2xl bg-white p-6 shadow-sm'>
            <h2 className='mb-2 text-lg font-bold text-slate-800'>{feature.title}</h2>
            <p className='text-sm leading-relaxed text-slate-600'>{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
