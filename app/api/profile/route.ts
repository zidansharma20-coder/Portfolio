import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()
    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    let profile = await prisma.profile.findFirst()

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name: data.name,
          role: data.role,
          bio: data.bio,
          profileImage: data.profileImage,
          heroImage: data.heroImage,
          aboutText: data.aboutText,
          email: data.email,
          linkedin: data.linkedin,
          instagram: data.instagram,
          dribbble: data.dribbble,
          behance: data.behance,
        }
      })
    } else {
      profile = await prisma.profile.create({
        data: {
          name: data.name,
          role: data.role,
          bio: data.bio,
          profileImage: data.profileImage,
          heroImage: data.heroImage,
          aboutText: data.aboutText,
          email: data.email,
          linkedin: data.linkedin,
          instagram: data.instagram,
          dribbble: data.dribbble,
          behance: data.behance,
        }
      })
    }

    revalidatePath('/')
    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
