import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { Work } from '@/components/work'
import { Stats } from '@/components/stats'
import { Process } from '@/components/process'
import { Testimonials } from '@/components/testimonials'
import { Skills } from '@/components/skills'
import { ContactCta } from '@/components/contact-cta'
import { SiteFooter } from '@/components/site-footer'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const dbProjects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  const profile = await prisma.profile.findFirst()
  
  // Map database projects to the UI Project format
  const mappedProjects = dbProjects.map(p => ({
    slug: p.id,
    title: p.title,
    tagline: p.tags[0] || 'PROJECT',
    category: p.tags[0] || 'Other',
    description: p.description,
    role: 'Creator',
    year: new Date(p.createdAt).getFullYear().toString(),
    approach: p.link || 'No link provided',
    image: p.imageUrl || '/placeholder.svg'
  }))

  return (
    <>
      <SiteNav />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Services />
        <Work initialProjects={mappedProjects} />
        <Stats />
        <Process />
        <Testimonials />
        <Skills />
        <ContactCta profile={profile} />
      </main>
      <SiteFooter profile={profile} />
    </>
  )
}
