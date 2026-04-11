const diseases = [
  {
    title: "Eczema",
    description: "An inflammatory skin condition that often causes dryness, itching, and irritation.",
  },
  {
    title: "Viral Infections",
    description: "Skin infections caused by viruses that may appear as rashes, bumps, or blisters.",
  },
  {
    title: "Melanoma",
    description: "A serious form of skin cancer that can develop in pigmented skin cells.",
  },
  {
    title: "Atopic Dermatitis",
    description: "A chronic eczema subtype linked to immune sensitivity and recurrent itchy patches.",
  },
  {
    title: "Basal Cell Carcinoma",
    description: "The most common skin cancer, often appearing as slowly growing lesions.",
  },
  {
    title: "Melanocytic Nevi",
    description: "Common moles formed by clusters of pigment-producing skin cells.",
  },
  {
    title: "Keratosis-like Lesions",
    description: "Rough or thickened skin growths that can resemble benign keratotic conditions.",
  },
  {
    title: "Psoriasis & Lichen Planus",
    description: "Inflammatory skin disorders that may cause scaly plaques or itchy purple lesions.",
  },
  {
    title: "Seborrheic Keratoses",
    description: "Non-cancerous skin growths with a waxy or stuck-on appearance.",
  },
  {
    title: "Fungal Infections",
    description: "Infections caused by fungi that can lead to red, itchy, or scaly skin patches.",
  },
];

export function AboutPage() {
  return (
    <div className='space-y-8'>
      <section className='rounded-3xl bg-white/85 p-8 text-center shadow-sm'>
        <h1 className='mb-3 text-4xl font-extrabold text-slate-800'>About GlowAI</h1>
        <p className='mx-auto max-w-3xl text-slate-600'>
          GlowAI helps users get quick AI-powered insights into facial skin conditions and supports better skincare
          decision making.
        </p>
      </section>

      <section className='rounded-2xl bg-white p-8 shadow-sm'>
        <h2 className='mb-3 text-2xl font-bold text-slate-800'>Our Mission</h2>
        <p className='text-slate-600'>
          We aim to make early skin-condition awareness more accessible through easy image uploads, fast model
          predictions, and clear condition summaries.
        </p>
      </section>

      <section>
        <h2 className='mb-4 text-2xl font-bold text-slate-800'>Skin Conditions We Detect</h2>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {diseases.map((disease) => (
            <article key={disease.title} className='rounded-2xl bg-white p-6 shadow-sm'>
              <h3 className='mb-2 text-lg font-semibold text-slate-800'>{disease.title}</h3>
              <p className='text-sm leading-relaxed text-slate-600'>{disease.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
