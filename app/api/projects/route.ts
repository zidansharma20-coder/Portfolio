import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        link: data.link,
        repoUrl: data.repoUrl,
        tags: data.tags || [],
        order: data.order || 0
      }
    })
    revalidatePath('/')
    return NextResponse.json({ project })
  } catch (error: any) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    const { id, ...updateData } = data

    const project = await prisma.project.update({
      where: { id },
      data: updateData
    })
    revalidatePath('/')
    revalidatePath(`/work/${id}`)
    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await prisma.project.delete({
      where: { id }
    })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
