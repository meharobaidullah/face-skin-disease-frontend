import { useState, useRef } from "react";
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
  Acne: {
    description: "A common skin condition that occurs when hair follicles become plugged with oil and dead skin cells.",
    suggestions: [
      "Keep your face clean by washing twice daily with a gentle cleanser",
      "Avoid touching or picking at acne lesions",
      "Use non-comedogenic (non-pore-clogging) skincare products",
      "Consider over-the-counter treatments with benzoyl peroxide or salicylic acid",
      "Maintain a healthy diet and stay hydrated",
      "Consult a dermatologist if acne persists or worsens",
    ],
  },
  "Actinic Keratosis": {
    description:
      "A rough, scaly patch on the skin caused by years of sun exposure. It's considered a precancerous condition.",
    suggestions: [
      "Schedule an appointment with a dermatologist for proper evaluation",
      "Protect your skin from UV rays with broad-spectrum sunscreen (SPF 30+)",
      "Wear protective clothing and seek shade during peak sun hours",
      "Avoid tanning beds and excessive sun exposure",
      "Regular skin checks are important for early detection",
      "Treatment options may include cryotherapy, topical medications, or other procedures",
    ],
  },
  "Basal Cell Carcinoma": {
    description:
      "The most common type of skin cancer. It typically appears as a slightly transparent bump on the skin.",
    suggestions: [
      "Seek immediate medical attention from a dermatologist",
      "Early detection and treatment are crucial for successful outcomes",
      "Protect your skin from UV radiation with sunscreen and protective clothing",
      "Regular skin self-examinations are recommended",
      "Follow your dermatologist's treatment plan closely",
      "Avoid excessive sun exposure and tanning beds",
    ],
  },
  Eczemaa: {
    description: "A condition that makes your skin red and itchy. It's common in children but can occur at any age.",
    suggestions: [
      "Moisturize your skin regularly with fragrance-free creams or ointments",
      "Identify and avoid triggers such as certain soaps, detergents, or fabrics",
      "Take shorter, lukewarm baths or showers",
      "Use gentle, unscented skincare products",
      "Apply moisturizer immediately after bathing to lock in moisture",
      "Consider consulting a dermatologist for prescription treatments if needed",
    ],
  },
  Rosacea: {
    description:
      "A chronic skin condition that causes redness and visible blood vessels in your face. It may also produce small, red, pus-filled bumps.",
    suggestions: [
      "Identify and avoid triggers such as spicy foods, alcohol, hot beverages, and extreme temperatures",
      "Use gentle, fragrance-free skincare products designed for sensitive skin",
      "Protect your skin from sun exposure with broad-spectrum sunscreen",
      "Avoid harsh scrubs and exfoliants that can irritate the skin",
      "Consider consulting a dermatologist for prescription treatments",
      "Manage stress as it can trigger flare-ups",
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
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>Face Skin Disease Detection</CardTitle>
        <CardDescription>Upload one or more images to get predictions for skin diseases</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <Upload className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-sm text-muted-foreground mb-2'>Drag and drop images here, or click to select</p>
          <Button type='button' variant='outline' onClick={() => fileInputRef.current?.click()}>
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
            <h3 className='text-sm font-medium'>Selected Files ({files.length})</h3>
            <div className='space-y-2 max-h-60 overflow-y-auto'>
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className='flex items-center justify-between p-3 border rounded-lg bg-muted/50'
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
                      <p className='text-sm font-medium truncate'>{file.name}</p>
                      <p className='text-xs text-muted-foreground'>{formatFileSize(file.size)}</p>
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
        <Button onClick={handleSubmit} disabled={files.length === 0 || mutation.isPending} className='w-full' size='lg'>
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
                <div className='flex items-center gap-2 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400' />
                  <h4 className='font-medium text-green-900 dark:text-green-100'>Prediction Complete</h4>
                </div>

                {/* Main Prediction */}
                <Card className='border-2 border-primary/20'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-2xl'>{data.final_prediction}</CardTitle>
                    <CardDescription className='text-base'>{suggestions.description}</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Confidence */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='font-medium'>Confidence Level</span>
                        <span className='text-primary font-semibold'>{(data.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-3 overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500'
                          style={{ width: `${data.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* All Probabilities */}
                    <div className='space-y-2'>
                      <h5 className='text-sm font-semibold'>All Predictions</h5>
                      <div className='space-y-2'>
                        {sortedProbabilities.map(([disease, probability]) => (
                          <div key={disease} className='space-y-1'>
                            <div className='flex items-center justify-between text-sm'>
                              <span className={cn("font-medium", disease === data.final_prediction && "text-primary")}>
                                {disease}
                              </span>
                              <span
                                className={cn(
                                  "text-muted-foreground",
                                  disease === data.final_prediction && "text-primary font-semibold"
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
                                    ? "bg-gradient-to-r from-primary to-primary/80"
                                    : "bg-muted-foreground/30"
                                )}
                                style={{ width: `${probability * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Helpful Suggestions */}
                <Card className='bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center gap-2'>
                      <Info className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                      <CardTitle className='text-lg text-blue-900 dark:text-blue-100'>Helpful Suggestions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className='space-y-2'>
                      {suggestions.suggestions.map((suggestion, index) => (
                        <li key={index} className='flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100'>
                          <span className='text-blue-600 dark:text-blue-400 mt-1'>•</span>
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
          <div className='p-4 border rounded-lg bg-red-50 dark:bg-red-950/20'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-red-600' />
              <h4 className='font-medium text-red-900 dark:text-red-100'>
                Error: {mutation.error instanceof Error ? mutation.error.message : "Failed to get predictions"}
              </h4>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
