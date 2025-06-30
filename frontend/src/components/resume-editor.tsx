"use client";

import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type ResumeData,
  ResumeDataSchema,
} from "@/ai/schemas";
import { suggestResumeImprovements } from "@/ai/flows/suggest-resume-improvements";
import { enhanceExperience } from "@/ai/flows/enhance-experience";
import { Download, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { saveResume } from "@/app/actions";

interface ResumeEditorProps {
  initialData: ResumeData;
  onReset: () => void;
}

export function ResumeEditor({ initialData, onReset }: ResumeEditorProps) {
  const form = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialData,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    const data = form.getValues();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleEnhanceResume = async () => {
    setIsEnhancing(true);
    try {
      const currentData = form.getValues();
      const improvedData = await suggestResumeImprovements(currentData);
      form.reset(improvedData);
      toast({
        title: "Resume Enhanced!",
        description: "The AI has improved your entire resume.",
      });
    } catch (error) {
      console.error("Failed to enhance resume:", error);
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance the resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const onSubmit = async (data: ResumeData) => {
    setIsSaving(true);
    try {
      const result = await saveResume(data);
      toast({
        title: "Resume Saved!",
        description: result.message,
      });
    } catch(error) {
       console.error("Failed to save resume:", error);
       toast({ title: "Save Failed", description: "Could not save resume.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
              <CardTitle>Edit Your Resume</CardTitle>
              <CardDescription>
                Refine the extracted details. Use the AI enhancer for a professional
                touch.
              </CardDescription>
            </div>
            <Button type="button" onClick={handleEnhanceResume} disabled={isEnhancing} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Sparkles className="mr-2 h-5 w-5" />
              {isEnhancing ? "Enhancing..." : "Enhance with AI"}
            </Button>
          </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfo form={form} />
            <ExperienceSection form={form} />
            <ProjectsSection form={form} />
            <SkillsSection form={form} />
            <EducationSection form={form} />

            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button type="button" onClick={onReset} variant="outline">
                Start Over
              </Button>
              <div className="flex gap-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Resume"}
                </Button>
                <Button type="button" onClick={handleDownload}>
                  <Download className="mr-2" />
                  Download JSON
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// --- Helper Components for each section ---

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-10 mb-4">
      <h3 className="text-2xl font-headline font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function BasicInfo({ form }: { form: UseFormReturn<ResumeData> }) {
  return (
    <section>
      <SectionHeader title="Basic Information" description="Your contact details." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="e.g. Jane Doe" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="e.g. jane.doe@email.com" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input placeholder="e.g. 123-456-7890" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}

function ExperienceSection({ form }: { form: UseFormReturn<ResumeData> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleEnhanceExperience = async (index: number) => {
    setEnhancingIndex(index);
    try {
      const currentExperience = form.getValues(`experience.${index}`);

      if (!currentExperience.description?.trim()) {
        toast({
          title: "Cannot Enhance",
          description: "Please add a description before enhancing.",
          variant: "destructive",
        });
        return;
      }
      
      const enhancedExperience = await enhanceExperience(currentExperience);
      
      form.setValue(`experience.${index}`, enhancedExperience, {
        shouldValidate: true,
        shouldDirty: true,
      });

      toast({
        title: "Experience Enhanced",
        description: "AI has improved this work experience entry.",
      });
    } catch (error) {
      console.error("Failed to enhance experience:", error);
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance this experience. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnhancingIndex(null);
    }
  };


  return (
    <section>
      <SectionHeader title="Work Experience" description="Your professional history." />
      <div className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-4 bg-card/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`experience.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl><Input placeholder="e.g. Software Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name={`experience.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl><Input placeholder="e.g. Tech Innovations Inc." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
               <FormField
                control={form.control}
                name={`experience.${index}.dates`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dates</FormLabel>
                    <FormControl><Input placeholder="e.g. Jan 2020 - Present" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name={`experience.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Describe your responsibilities and achievements..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEnhanceExperience(index)}
                  disabled={enhancingIndex === index}
              >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {enhancingIndex === index ? "Enhancing..." : "Enhance with AI"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Experience
              </Button>
            </div>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ title: "", company: "", dates: "", description: "" })}
        >
          <PlusCircle className="mr-2" />
          Add Experience
        </Button>
      </div>
    </section>
  );
}

function EducationSection({ form }: { form: UseFormReturn<ResumeData> }) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "education",
    });

    return (
      <section>
        <SectionHeader title="Education" description="Your academic background." />
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 bg-card/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree / Certificate</FormLabel>
                      <FormControl><Input placeholder="e.g. B.S. in Computer Science" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`education.${index}.school`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School / University</FormLabel>
                      <FormControl><Input placeholder="e.g. State University" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                 <FormField
                  control={form.control}
                  name={`education.${index}.dates`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dates</FormLabel>
                      <FormControl><Input placeholder="e.g. Sep 2016 - May 2020" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
                className="mt-4"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Education
              </Button>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ degree: "", school: "", dates: "" })}
          >
            <PlusCircle className="mr-2" />
            Add Education
          </Button>
        </div>
      </section>
    );
  }

function ProjectsSection({ form }: { form: UseFormReturn<ResumeData> }) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "projects",
    });

    return (
      <section>
        <SectionHeader title="Projects" description="Showcase your personal or professional projects." />
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 bg-card/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Portfolio Website" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`projects.${index}.link`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Link</FormLabel>
                      <FormControl><Input placeholder="e.g. https://myproject.com" {...field} value={field.value ?? ''}/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea rows={3} placeholder="Describe your project, your role, and the technologies used." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
                className="mt-4"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Project
              </Button>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", description: "", link: "" })}
          >
            <PlusCircle className="mr-2" />
            Add Project
          </Button>
        </div>
      </section>
    );
}

function SkillsSection({ form }: { form: UseFormReturn<ResumeData> }) {
  const skills = form.watch("skills");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const skillsArray = text.split(',').map(s => s.trim()).filter(Boolean);
    form.setValue("skills", skillsArray, { shouldValidate: true });
  }

  return (
    <section>
      <SectionHeader title="Skills" description="List your skills, separated by commas." />
      <FormField
        control={form.control}
        name="skills"
        render={() => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <Textarea 
                rows={3} 
                placeholder="e.g. React, TypeScript, Node.js, Project Management" 
                value={skills?.join(', ') || ''}
                onChange={handleTextChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}
