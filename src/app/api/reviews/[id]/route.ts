import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: {
    id: string;
  };
};

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

export async function GET(request: Request, { params }: RouteParams) {
  const id = parseId(params.id);

  if (id === null) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  return NextResponse.json(review);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const id = parseId(params.id);

  if (id === null) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    const body = await request.json();

    const filmTitle =
      typeof body.filmTitle === "string" ? body.filmTitle.trim() : "";
    const reviewNotes =
      typeof body.reviewNotes === "string" ? body.reviewNotes.trim() : "";
    const personalRating = Number(body.personalRating);

    if (!filmTitle || !reviewNotes || Number.isNaN(personalRating)) {
      return NextResponse.json(
        { error: "filmTitle, personalRating, and reviewNotes are required." },
        { status: 400 }
      );
    }

    if (personalRating < 1 || personalRating > 5) {
      return NextResponse.json(
        { error: "personalRating must be between 1 and 5." },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        filmTitle,
        personalRating,
        reviewNotes,
      },
    });

    return NextResponse.json(review);
  } catch (error: unknown) {
    const maybePrismaError = error as { code?: string } | null;
    if (maybePrismaError && maybePrismaError.code === "P2025") {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to update review." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const id = parseId(params.id);

  if (id === null) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const maybePrismaError = error as { code?: string } | null;
    if (maybePrismaError && maybePrismaError.code === "P2025") {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to delete review." }, { status: 500 });
  }
}
