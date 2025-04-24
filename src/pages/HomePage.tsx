import React from 'react';
import { Music, BookOpen, Clock, Award, ChevronRight } from "lucide-react"
import { Button } from '../components/ui/Button'

import { TRAINING_PROGRAMS } from "@/trainingProgram/trainingPrograms";
import { TrainingSessionCard } from "@/trainingProgram/components/TrainingSessionCard";
import { Link } from "react-router-dom";
import { ROUTES } from "@/router";

const HomePage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Master Sheet Music Reading
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Improve your eye-hand coordination with interactive sheet
                    music reading exercises. Practice scales, chords, and
                    melodies at your own pace.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Start Practicing <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      5+ Exercises
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Learn at Your Pace
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Track Progress
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <h2 className="text-xl font-semibold tracking-tight mb-4">
                    Start a Training Session
                  </h2>
                  <div className="grid gap-4">
                    {TRAINING_PROGRAMS.map((program) => (
                      <TrainingSessionCard
                        key={program.id}
                        title={program.name}
                        description={program.description}
                        difficulty={program.difficulty}
                        duration="5 min"
                        id={program.id}
                      />
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link">View All Training Sessions</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our interactive platform makes learning to read sheet music
                  and develop eye-hand coordination enjoyable and effective.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Choose a Lesson</h3>
                  <p className="text-center text-muted-foreground">
                    Select from our library of training sessions based on your
                    skill level and goals.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Practice</h3>
                  <p className="text-center text-muted-foreground">
                    Follow along with interactive sheet music and get real-time
                    feedback on your playing.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Track Progress</h3>
                  <p className="text-center text-muted-foreground">
                    Monitor your improvement over time and unlock new challenges
                    as you advance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container px-4 md:px-6 py-12 max-w-5xl">
            <div className="rounded-lg border bg-card p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Upload Your Own Music
              </h2>
              <p className="text-muted-foreground mb-6">
                Use a MIDI or MusicXML file to generate custom training
                exercises based on your own sheet music.
              </p>
              <Button size="lg">
                <Link to={ROUTES.upload()}>Upload MIDI or MusicXML</Link>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 PianoReader. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
