# Face Skin Disease Detection — Frontend

AI-powered web application for detecting skin conditions from facial images. Upload one or more photos and receive real-time predictions with confidence scores and actionable suggestions.

## Features

- **Multi-image upload** — Drag & drop or click to select multiple images at once
- **Real-time AI predictions** — Powered by a backend ML model (11 supported conditions)
- **Confidence scoring** — Visual confidence bars for the top prediction and all probabilities
- **Condition-specific guidance** — Tailored suggestions and descriptions for each detected condition
- **Medical disclaimer** — Clear notice that AI results are for support, not final diagnosis
- **Responsive design** — Works on desktop and mobile

## Supported Conditions

| Condition | Description |
|-----------|-------------|
| **Eczema** | Chronic inflammatory condition causing red, itchy, sensitive skin |
| **Viral Infections** | Skin infections from viral pathogens (herpes, varicella, etc.) |
| **Melanoma** | Most serious skin cancer from melanocytes |
| **Atopic Dermatitis** | Chronic inflammatory condition with intense itching and dryness |
| **Basal Cell Carcinoma** | Most common skin cancer, appears as translucent/pearly bumps |
| **Melanocytic Nevi** | Benign moles composed of melanocytes |
| **Keratosis-like Lesions** | Benign raised growths with waxy/scaly appearance |
| **Psoriasis & Lichen Planus** | Chronic inflammatory conditions (scaly patches, purplish bumps) |
| **Seborrheic Keratoses** | Common benign growths in older adults, waxy/scaly |
| **Fungal Infections** | Skin infections from dermatophytes (ringworm, athlete's foot) |

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite 7** — Build tool & dev server
- **Tailwind CSS 3.4** — Utility-first styling
- **React Router 7** — Client-side routing
- **TanStack React Query 5** — Server state & mutations
- **Axios** — HTTP client
- **Lucide React** — Icons
- **CVA + clsx + tailwind-merge** — Component variant styling (shadcn/ui pattern)

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Card)
│   ├── AppNavbar.tsx    # Navigation bar
│   └── FileUpload.tsx   # Drag-drop upload + results display
├── lib/
│   ├── api.ts           # API client (predictBatch)
│   └── utils.ts         # cn() utility for class merging
├── pages/
│   ├── HomePage.tsx     # Landing page
│   ├── AboutPage.tsx    # About / info page
│   └── SkinDetectionPage.tsx  # Main detection workflow
├── App.tsx              # Routes + layout
└── main.tsx             # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/face-skin-disease-frontend.git
cd face-skin-disease-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The backend API should expose a `POST /predict` endpoint accepting `multipart/form-data` with an `images` field (array of files).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Backend Integration

The frontend calls `predictBatch(files)` from `src/lib/api.ts`, which sends a `POST` request to `${import.meta.env.VITE_API_BASE_URL}/predict` with `Content-Type: multipart/form-data`.

Expected response format:

```json
{
  "num_images": 3,
  "final_prediction": "Melanoma",
  "confidence": 0.87,
  "probabilities": {
    "Melanoma": 0.87,
    "Melanocytic Nevi": 0.08,
    "Basal Cell Carcinoma": 0.05
  }
}
```

## Deployment

Build for production:

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.). Set `VITE_API_BASE_URL` in your hosting platform's environment variables.

## Disclaimer

> **This AI prediction can be wrong. Use it as a support tool, not a final medical diagnosis.**

Always consult a qualified dermatologist or healthcare professional for medical concerns.

## License

MIT — feel free to use, modify, and distribute.

---

Built with ❤️ for skin health awareness.