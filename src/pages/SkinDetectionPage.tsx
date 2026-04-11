import { FileUpload } from "@/components/FileUpload";

export function SkinDetectionPage() {
  return (
    <div className='space-y-8'>
      <section className='rounded-3xl bg-white/85 p-8 text-center shadow-sm backdrop-blur md:p-10'>
        <p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500'>Skin Detection</p>
        <h1 className='mb-3 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl'>
          Face Skin Disease Detection
        </h1>
        <p className='mx-auto max-w-3xl text-base text-slate-600 md:text-lg'>
          Upload one or more images to get AI-powered predictions and confidence scores for supported skin conditions.
        </p>
      </section>

      <div className='mx-auto max-w-5xl'>
        <FileUpload />
      </div>
    </div>
  );
}
