import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Lightbulb, KeyRound, Puzzle, Target, TrendingUp } from "lucide-react";
import type { SVGProps } from "react";

const FeatureIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Discover Your Future, One Game at a Time 🎮✨
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Stop guessing. Start playing. CareerQuest turns self-discovery into an adventure, helping you find a career you’ll love.
                </p>
              </div>
              <Button asChild size="lg" className="font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <Link href="/login">Start Your Quest</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Your Adventure in 3 Simple Steps</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow our simple, fun process to unlock personalized career paths tailored to your unique skills.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center p-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <Gamepad2 className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-headline">1. Play Fun Games</h3>
                <p className="text-muted-foreground">Engage in quick, interactive mini-games designed to reveal your core strengths and abilities.</p>
              </div>
              <div className="grid gap-1 text-center p-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <Lightbulb className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-headline">2. Discover Your Skills</h3>
                <p className="text-muted-foreground">Get instant feedback on your performance and see a visual profile of your unique skill set.</p>
              </div>
              <div className="grid gap-1 text-center p-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <KeyRound className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-headline">3. Unlock Careers</h3>
                <p className="text-muted-foreground">Receive personalized, AI-powered career suggestions that match your talents and passions.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Why Choose CareerQuest?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We believe career planning should be exciting, not exhausting. Here’s what makes our approach different.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/10 text-accent"><Puzzle className="h-6 w-6" /></div>
                  <CardTitle className="font-headline">Gamified & Fun</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No more boring questionnaires. Our mini-games make learning about yourself an enjoyable experience.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/10 text-accent"><Target className="h-6 w-6" /></div>
                  <CardTitle className="font-headline">Accurate & Personalized</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Powered by smart AI, our suggestions are tailored to your unique skill profile, not just generic answers.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/10 text-accent"><TrendingUp className="h-6 w-6" /></div>
                  <CardTitle className="font-headline">Future-Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Discover careers that are in demand and align with the skills needed for tomorrow's job market.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
