import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { predictBatch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PredictionResponse {
  num_images: number;
  final_prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

const diseaseSuggestions: Record<string, { description: string; suggestions: string[] }> = {
  Eczema: {
    description:
      "A chronic inflammatory condition that makes your skin red, itchy, and sensitive. It commonly appears in patches and can occur at any age.",
    suggestions: [
      "Moisturize your skin regularly with fragrance-free creams or ointments",
      "Identify and avoid triggers such as certain soaps, detergents, or fabrics",
      "Take shorter, lukewarm baths or showers",
      "Use gentle, unscented skincare products",
      "Apply moisturizer immediately after bathing to lock in moisture",
      "Consider consulting a dermatologist for prescription treatments if needed",
    ],
  },
  "Viral Infections": {
    description:
      "Skin infections caused by viral pathogens, which can manifest as blisters, rashes, or lesions. Common viral skin infections include herpes simplex and varicella.",
    suggestions: [
      "Keep the affected area clean and dry",
      "Avoid touching or scratching the infected area to prevent spread",
      "Use antiviral medications as prescribed by a dermatologist",
      "Avoid contact with others to prevent transmission",
      "Maintain good hygiene practices and wash hands frequently",
      "Consult a dermatologist for proper diagnosis and treatment options",
    ],
  },
  Melanoma: {
    description:
      "The most serious type of skin cancer. It develops from melanocytes (pigment-producing cells) and can spread to other parts of the body if not treated early.",
    suggestions: [
      "Seek immediate medical attention from an oncologist or dermatologist",
      "Early detection and treatment are critical for survival",
      "Do not delay seeking professional medical evaluation",
      "Protect your skin from UV radiation with broad-spectrum sunscreen (SPF 50+)",
      "Perform regular skin self-examinations and monitor for changes",
      "Avoid sun exposure and use protective clothing and hats",
    ],
  },
  "Atopic Dermatitis": {
    description:
      "A chronic inflammatory skin condition characterized by intense itching, redness, and dry skin. It commonly appears on the face, hands, and other body areas.",
    suggestions: [
      "Use hypoallergenic moisturizers daily to maintain skin barrier",
      "Identify and avoid personal triggers like certain soaps or fragrances",
      "Avoid hot water; use lukewarm water for bathing",
      "Wear soft, breathable clothing to minimize irritation",
      "Apply topical corticosteroids or other prescribed medications as directed",
      "Consult a dermatologist if symptoms worsen or don't improve",
    ],
  },
  "Basal Cell Carcinoma": {
    description:
      "The most common type of skin cancer. It typically appears as a translucent, waxy, or pearly bump on the skin, often with a central depression.",
    suggestions: [
      "Seek immediate medical attention from a dermatologist",
      "Early detection and treatment significantly improve outcomes",
      "Protect your skin from UV radiation with sunscreen and protective clothing",
      "Perform regular skin self-examinations",
      "Follow your dermatologist's treatment plan closely",
      "Avoid excessive sun exposure and tanning beds",
    ],
  },
  "Melanocytic Nevi": {
    description:
      "Commonly known as moles, these are benign skin growths composed of melanocytes. Most people have multiple nevi that are typically harmless.",
    suggestions: [
      "Monitor nevi for changes using the ABCDE rule (Asymmetry, Border, Color, Diameter, Evolution)",
      "Protect your skin from sun exposure with broad-spectrum sunscreen",
      "Perform regular self-examinations and note any changes",
      "Consult a dermatologist if you notice rapid growth or changes",
      "Avoid unnecessary sun exposure, especially during peak hours",
      "Seek professional evaluation if a mole becomes painful or itchy",
    ],
  },
  "Keratosis-like Lesions": {
    description:
      "Benign skin growths that appear raised and may have a waxy, scaly, or warty appearance. They are generally harmless but can sometimes be cosmetically concerning.",
    suggestions: [
      "Monitor lesions for any changes in size, color, or appearance",
      "Protect your skin from sun exposure with broad-spectrum sunscreen",
      "Avoid picking or scratching at the lesions",
      "Consult a dermatologist for proper diagnosis and confirmation",
      "Removal is optional and can be done for cosmetic reasons",
      "Follow professional guidance if lesions become irritated or inflamed",
    ],
  },
  "Psoriasis & Lichen Planus": {
    description:
      "Chronic inflammatory skin conditions. Psoriasis presents with red, scaly patches, while lichen planus appears as small, flat, purplish bumps or lines.",
    suggestions: [
      "Keep your skin moisturized with fragrance-free products",
      "Identify and manage stress, as it can trigger flare-ups",
      "Avoid harsh soaps and use lukewarm water for bathing",
      "Protect affected areas from injury and irritation",
      "Use prescribed topical treatments such as corticosteroid creams",
      "Consult a dermatologist about systemic treatments if needed",
    ],
  },
  "Seborrheic Keratoses": {
    description:
      "Common benign skin growths that typically appear in older adults. They have a waxy, scaly appearance and are usually brown, black, or tan.",
    suggestions: [
      "Monitor lesions for any changes, though they are typically benign",
      "Avoid picking or scratching at the growths",
      "Protect your skin from sun exposure with broad-spectrum sunscreen",
      "Removal is optional and can be done for cosmetic or comfort reasons",
      "Consult a dermatologist if lesions become irritated or inflamed",
      "Regular skin checks help ensure lesions remain stable",
    ],
  },
  "Fungal Infections": {
    description:
      "Skin infections caused by fungal organisms such as dermatophytes. Common types include athlete's foot, ringworm, and yeast infections.",
    suggestions: [
      "Keep the affected area clean and dry",
      "Use antifungal creams or ointments as prescribed",
      "Avoid wearing tight clothing over infected areas",
      "Change socks and underwear if they become damp",
      "Avoid sharing personal items like towels or nail clippers",
      "Consult a dermatologist if the infection persists or spreads",
    ],
  },
};

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: predictBatch,
    onSuccess: (data) => {
      console.log("Prediction successful:", data);
    },
    onError: (error) => {
      console.error("Prediction failed:", error);
    },
  });

  useEffect(() => {
    if (files.length === 0) {
      mutation.reset();
    }
  }, [files.length, mutation]);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== fileArray.length) {
      alert("Please select only image files");
      return;
    }

    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      alert("Please select at least one image file");
      return;
    }
    mutation.mutate(files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Card className='mx-auto w-full max-w-4xl rounded-3xl border-white/70 bg-white/90 shadow-sm backdrop-blur'>
      <CardHeader className='border-b border-rose-100/70 pb-6 text-center'>
        <CardTitle className='text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl'>
          Analyze Your Skin Images
        </CardTitle>
        <CardDescription className='mx-auto max-w-2xl text-base text-slate-600'>
          Upload one or more images and receive model predictions with confidence scores.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6 p-6 md:p-8'>
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
            isDragging
              ? "border-rose-500 bg-rose-50"
              : "border-rose-200 bg-rose-50/40 hover:border-rose-400 hover:bg-rose-50/70",
          )}
        >
          <Upload className='mx-auto mb-4 h-12 w-12 text-rose-500' />
          <p className='mb-2 text-sm text-slate-600'>Drag and drop images here, or click to select</p>
          <Button
            type='button'
            variant='outline'
            onClick={() => fileInputRef.current?.click()}
            className='border-rose-300 bg-white text-rose-700 hover:bg-rose-50'
          >
            Select Images
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='image/*'
            className='hidden'
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className='space-y-2'>
            <h3 className='text-sm font-semibold text-slate-800'>Selected Files ({files.length})</h3>
            <div className='space-y-2 max-h-60 overflow-y-auto'>
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className='flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3'
                >
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <div className='flex-shrink-0'>
                      {file.type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className='w-12 h-12 object-cover rounded'
                        />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate text-slate-800'>{file.name}</p>
                      <p className='text-xs text-slate-500'>{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => removeFile(index)}
                    className='flex-shrink-0'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={files.length === 0 || mutation.isPending}
          className='w-full bg-rose-500 text-white hover:bg-rose-600'
          size='lg'
        >
          {mutation.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            <>
              <Upload className='mr-2 h-4 w-4' />
              Get Predictions
            </>
          )}
        </Button>

        <p className='rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
          Disclaimer: this AI prediction can be wrong. Use it as a support tool, not a final medical diagnosis.
        </p>

        {/* Results */}
        {mutation.isSuccess &&
          (() => {
            const data = mutation.data as PredictionResponse;
            const sortedProbabilities = Object.entries(data.probabilities || {}).sort(([, a], [, b]) => b - a);
            const suggestions = diseaseSuggestions[data.final_prediction] || {
              description: "A skin condition detected in the image.",
              suggestions: [
                "Consult with a dermatologist for proper diagnosis and treatment",
                "Follow medical advice and treatment plans",
                "Protect your skin from excessive sun exposure",
                "Maintain a healthy skincare routine",
              ],
            };

            return (
              <div className='space-y-4'>
                {/* Success Header */}
                <div className='flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4'>
                  <CheckCircle2 className='h-5 w-5 text-emerald-600' />
                  <h4 className='font-medium text-emerald-900'>Prediction Complete</h4>
                </div>

                {/* Main Prediction */}
                <Card className='rounded-2xl border border-slate-200'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-2xl text-slate-800'>{data.final_prediction}</CardTitle>
                    <CardDescription className='text-base text-slate-600'>{suggestions.description}</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Confidence */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='font-medium text-slate-700'>Confidence Level</span>
                        <span className='font-semibold text-rose-600'>{(data.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-3 overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500'
                          style={{ width: `${data.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* All Probabilities */}
                    {(() => {
                      const filteredProbabilities = sortedProbabilities.filter(
                        ([, probability]) => (probability * 100).toFixed(2) !== "0.00"
                      );
                      const hasFullConfidence = filteredProbabilities.some(
                        ([, probability]) => (probability * 100).toFixed(2) === "100.00"
                      );

                      return (
                        !hasFullConfidence && (
                          <div className='space-y-2'>
                            <h5 className='text-sm font-semibold text-slate-800'>All Predictions</h5>
                            <div className='space-y-2'>
                              {filteredProbabilities.map(([disease, probability]) => (
                                <div key={disease} className='space-y-1'>
                                  <div className='flex items-center justify-between text-sm'>
                                    <span
                                      className={cn(
                                        "font-medium text-slate-700",
                                        disease === data.final_prediction && "text-rose-600",
                                      )}
                                    >
                                      {disease}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-slate-500",
                                        disease === data.final_prediction && "font-semibold text-rose-600",
                                      )}
                                    >
                                      {(probability * 100).toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                                    <div
                                      className={cn(
                                        "h-full transition-all duration-500",
                                        disease === data.final_prediction
                                          ? "bg-gradient-to-r from-rose-500 to-rose-400"
                                          : "bg-slate-300",
                                      )}
                                      style={{ width: `${probability * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Helpful Suggestions */}
                <Card className='rounded-2xl border-sky-200 bg-sky-50'>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center gap-2'>
                      <Info className='h-5 w-5 text-sky-600' />
                      <CardTitle className='text-lg text-sky-900'>Helpful Suggestions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className='space-y-2'>
                      {suggestions.suggestions.map((suggestion, index) => (
                        <li key={index} className='flex items-start gap-2 text-sm text-sky-900'>
                          <span className='mt-1 text-sky-600'>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

        {mutation.isError && (
          <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-red-600' />
              <h4 className='font-medium text-red-900'>
                Error: {mutation.error instanceof Error ? mutation.error.message : "Failed to get predictions"}
              </h4>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
