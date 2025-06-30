import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Bot, Rocket, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/15 z-0"></div>
        <div className="absolute inset-0 bg-dot-pattern opacity-10 z-0"></div>
        <div className="absolute top-20 -left-60 w-96 h-96 bg-primary/25 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 -right-60 w-96 h-96 bg-accent/25 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute top-1/4 right-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 left-20 w-40 h-40 bg-blue-400/10 rounded-full filter blur-3xl opacity-40"></div>
        
        <section className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center relative z-10">
          <div className="space-y-8 rounded-xl bg-card/80 backdrop-blur-md p-8 shadow-2xl border border-white/10 md:p-12 max-w-3xl animate-fade-in">
            <div>
              <div className="inline-block mb-3 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent border border-accent/20 shadow-sm">
                Resume AI Assistant
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-glow">
                Forge Your Career Path with AI
              </h1>
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed xl:text-xl/relaxed">
              Our AI-powered tool helps you craft the perfect resume. Upload your
              current resume and get instant suggestions to boost your profile,
              optimize keywords, and land your dream job.
            </p>
            <Link href="/upload" passHref>
              <Button
                size="lg"
                className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 relative overflow-hidden group transition-all duration-300"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </Link>
          </div>
        </section>
      </section>

      {/* Why Choose Us Section */}
      <section id="features" className="relative flex w-full min-h-screen flex-col justify-center px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-secondary/10 to-background"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-primary/15 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-1/4 left-20 w-60 h-60 bg-cyan-500/10 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-indigo-400/10 rounded-full filter blur-3xl opacity-25"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <div className="w-16 h-1 bg-accent mb-4"></div>              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Why Choose ResumeForge?
            </h2>
            <p className="max-w-2xl text-muted-foreground md:text-xl">
              Leverage cutting-edge AI to gain a competitive edge in your job
              search.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary mb-6 shadow-lg">
                <Bot className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline">
                Intelligent Parsing
              </h3>
              <p className="text-muted-foreground">
                Our AI accurately extracts data from your resume in seconds,
                saving you time and effort on manual entry.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary mb-6 shadow-lg">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline">
                Expert Suggestions
              </h3>
              <p className="text-muted-foreground">
                Receive expert-level feedback to enhance your resume's phrasing,
                impact, and professional tone.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary mb-6 shadow-lg">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline">
                ATS Optimization
              </h3>
              <p className="text-muted-foreground">
                Optimize your resume with relevant keywords to ensure it gets
                past automated screening systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative flex w-full min-h-screen flex-col justify-center px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-bl from-background via-accent/5 to-background"></div>
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute top-1/4 right-20 w-72 h-72 bg-teal-400/10 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-60 left-60 w-48 h-48 bg-amber-400/10 rounded-full filter blur-3xl opacity-25"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <div className="w-16 h-1 bg-accent mb-4"></div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Loved by Professionals
            </h2>
            <p className="max-w-2xl text-muted-foreground md:text-xl">
              Hear what our users have to say about their experience with
              ResumeForge.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/95 backdrop-blur-sm border border-white/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-4">
                  <Avatar className="border-2 border-white/20 shadow-lg">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Jane Doe" data-ai-hint="woman smiling" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">Jane Doe</p>
                    <p className="text-sm text-muted-foreground">
                      Software Engineer
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  "ResumeForge transformed my resume! The AI suggestions were
                  spot-on and helped me land my dream job in weeks. The interface
                  is incredibly easy to use."
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/95 backdrop-blur-sm border border-white/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-4">
                  <Avatar className="border-2 border-white/20 shadow-lg">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="John Smith" data-ai-hint="man professional" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">John Smith</p>
                    <p className="text-sm text-muted-foreground">
                      Product Manager
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  "The ATS optimization feature is a game-changer. I went from
                  getting no replies to multiple interviews almost immediately.
                  Highly recommended!"
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/95 backdrop-blur-sm border border-white/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-4">
                  <Avatar className="border-2 border-white/20 shadow-lg">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Sarah Lee" data-ai-hint="woman glasses" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">SL</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">Sarah Lee</p>
                    <p className="text-sm text-muted-foreground">UX Designer</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  "I loved how easy it was to use. I uploaded my old resume, and
                  within minutes, I had a polished, professional version that
                  I was proud to send out."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer Section */}
      <footer className="relative border-t border-border/40 bg-card/30 py-12">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent"></div>
        <div className="absolute bottom-0 right-10 w-40 h-40 bg-primary/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 left-20 w-32 h-32 bg-accent/10 rounded-full filter blur-3xl opacity-15"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <Rocket className="h-5 w-5" />
                </div>
                <span className="font-bold font-headline text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  ResumeForge
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Leveraging AI to help professionals craft impactful resumes that get results.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
