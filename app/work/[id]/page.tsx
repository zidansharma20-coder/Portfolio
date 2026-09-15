import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Calendar, Tag, User } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import prisma from '@/lib/prisma'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProjectPage({ params }: { params: { id: string } }) {
  // Try to find the project in the DB
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  }).catch(() => null)

  if (!project) {
    notFound()
  }

  // Map to format
  const title = project.title
  const category = project.tags[0] || 'Selected Work'
  const description = project.description
  const image = project.imageUrl || '/placeholder.svg'
  const year = new Date(project.createdAt).getFullYear().toString()
  const link = project.link

  // Also fetch profile for the footer
  const profile = await prisma.profile.findFirst()

  return (
    <>
      <SiteNav />
      <main className="min-h-screen pt-24 bg-background">
        <article>
          {/* ── Hero Banner with Parallax-like structure ── */}
          <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-neutral-900">
            <Image
              src={image}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover opacity-80"
              priority
              unoptimized
            />
            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-24">
              <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
                <Reveal>
                  <Link 
                    href="/#work" 
                    className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-primary/80 transition-colors hover:text-primary mb-6"
                  >
                    <ArrowLeft className="size-4" />
                    Back to Work
                  </Link>
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/80 backdrop-blur px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground">
                    {category}
                  </p>
                  <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                    {title}
                  </h1>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── Content Area ── */}
          <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              
              {/* Sidebar Metadata */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <Reveal delay={100}>
                  <div className="rounded-3xl bg-secondary/50 p-8 border border-border/50">
                    <h3 className="font-serif text-2xl italic mb-6 border-b border-border pb-4">Project Details</h3>
                    <dl className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <User className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Role</dt>
                          <dd className="mt-1 font-medium text-foreground">Creator / Visualizer</dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Calendar className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Year</dt>
                          <dd className="mt-1 font-medium text-foreground">{year}</dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Tag className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Category</dt>
                          <dd className="mt-1 font-medium text-foreground">{category}</dd>
                        </div>
                      </div>
                    </dl>

                    {link && (
                      <div className="mt-8 pt-8 border-t border-border">
                        <a 
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group flex w-full items-center justify-between rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]"
                        >
                          Visit Project
                          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </Reveal>
              </div>

              {/* Main Description */}
              <div className="lg:col-span-8">
                <Reveal delay={200}>
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-8">About the Project</h2>
                  <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                    <p className="text-pretty leading-relaxed text-muted-foreground whitespace-pre-wrap text-lg md:text-xl">
                      {description}
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── Next Project / CTA (Optional Footer-ish area) ── */}
          <section className="border-t border-border bg-secondary/30 py-24">
            <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
              <Reveal>
                <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
                  Ready to create something <span className="font-serif font-normal italic">similar?</span>
                </h2>
                <a
                  href="/#contact"
                  className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  Let&apos;s Collaborate
                  <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                </a>
              </Reveal>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter profile={profile} />
    </>
  )
}
