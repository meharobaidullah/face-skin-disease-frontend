import { FileUpload } from './components/FileUpload'

function App() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Face Skin Disease Detection
          </h1>
          <p className="text-muted-foreground">
            Upload images to get AI-powered skin disease predictions
          </p>
        </div>
        <FileUpload />
      </div>
    </div>
  )
}

export default App
