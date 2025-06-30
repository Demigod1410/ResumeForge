"use client";

import Link from 'next/link';
import { Rocket, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-6xl items-center justify-between px-0 mx-auto">
        <Link href="/" className="flex items-center space-x-2 group pl-4 md:pl-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground group-hover:shadow-md transition-all duration-300">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="font-bold font-headline text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:from-primary group-hover:to-accent transition-all duration-300">
            ResumeForge
          </span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center pr-0">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link href="/upload" passHref>
              <Button size="sm" variant="outline" className="border-primary hover:bg-primary hover:text-primary-foreground transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden pr-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-6xl mx-auto px-4 md:px-0 py-4 flex flex-col space-y-3">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-accent/10">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-accent/10">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-accent/10">
              Testimonials
            </Link>
            <Link href="/upload" className="mt-2" passHref>
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
