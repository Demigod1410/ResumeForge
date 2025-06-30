import { ResumeEnhancer } from '@/components/resume-enhancer';
import { Bot, FileText, Lightbulb, Rocket } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/15 z-0"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-10 z-0"></div>
      <div className="absolute top-20 -left-60 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl opacity-50 animate-pulse-slow z-0"></div>
      <div className="absolute bottom-20 -right-60 w-96 h-96 bg-accent/30 rounded-full filter blur-3xl opacity-50 animate-pulse-slower z-0"></div>
      <div className="absolute top-1/4 right-20 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl opacity-40 animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/3 left-20 w-40 h-40 bg-blue-400/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slower z-0"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-teal-300/10 rounded-full filter blur-3xl opacity-30 animate-pulse-slow z-0"></div>
      
      <div className="container mx-auto max-w-6xl py-12 px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Uploader and Editor */}
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-xl bg-card/80 backdrop-blur-sm p-6 border border-white/10 shadow-xl">
              <h1 className="text-3xl font-bold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-glow">
                Start Your Resume Transformation
              </h1>
              <p className="text-muted-foreground mt-2">
                Upload your resume and our AI will parse it into an editable form you can enhance.
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6">
              <ResumeEnhancer />
            </div>
          </div>

          {/* Right Column: The "How it works" guide */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 sticky top-28 border border-white/10 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold font-headline mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-glow">How It Works</h2>
            <ul className="space-y-6">
              <li className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg group-hover:scale-105 transition-all">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">1. Upload Resume</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Drag and drop or click to select your resume file (.pdf or .docx).
                  </p>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg group-hover:scale-105 transition-all">
                    <Bot className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">2. AI-Powered Parsing</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our AI reads and structures your resume content into editable fields.
                  </p>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg group-hover:scale-105 transition-all">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">3. Review & Enhance</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fine-tune the extracted data and use the AI enhancer to polish your resume.
                  </p>
                </div>
              </li>
               <li className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg group-hover:scale-105 transition-all">
                    <Rocket className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">4. Save & Download</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Save your progress or download the final resume as a JSON file.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
