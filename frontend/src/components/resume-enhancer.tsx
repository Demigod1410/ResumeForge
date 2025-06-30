"use client";

import { extractResumeData } from "@/ai/flows/extract-resume-data";
import { type ResumeData } from "@/ai/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { FileUpload } from "./file-upload";
import { ResumeEditor } from "./resume-editor";

type Status = "idle" | "processing" | "editing" | "error";
const ACCEPTED_FORMATS = "PDF, DOCX";
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function ResumeEnhancer() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "processing") {
      setProgress(10);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(timer);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  const readFileAsDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a ${ACCEPTED_FORMATS} file.`,
        variant: "destructive",
      });
      return;
    }

    setStatus("processing");
    setResumeData(null);
    try {
      const dataUri = await readFileAsDataUri(file);
      const parsedData = await extractResumeData({
        resumeDataUri: dataUri,
      });
      
      setResumeData(parsedData);
      setProgress(100);
      setTimeout(() => setStatus("editing"), 300);
    } catch (error) {
      console.error("Resume processing failed:", error);
      setStatus("error");
      toast({
        title: "Parsing Failed",
        description:
          "There was an error parsing your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setResumeData(null);
  };

  if (status === "processing") {
    return (
      <Card className="w-full bg-card/90 backdrop-blur-sm border border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-glow">Parsing Your Resume</CardTitle>
          <CardDescription className="text-center">
            Our AI is extracting the details... Please wait a moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-b-xl z-0"></div>
          <Bot className="h-16 w-16 mb-6 animate-pulse text-accent z-10" />
          <Progress
            value={progress}
            className="w-full [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent z-10"
          />
        </CardContent>
      </Card>
    );
  }

  if (status === "editing" && resumeData) {
    return <ResumeEditor initialData={resumeData} onReset={handleReset} />;
  }

  return (
    <div className="relative">
      {status === "error" && (
        <Card className="mb-4 border-destructive bg-destructive/10 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-destructive">
              Something Went Wrong
            </CardTitle>
            <CardDescription className="text-destructive/80">
              We couldn&apos;t process your resume. Please try uploading the
              file again.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl -z-10 opacity-60"></div>
        <FileUpload
          onFileSelect={handleFileSelect}
          acceptedFormats={ACCEPTED_FORMATS}
        />
      </div>
    </div>
  );
}
