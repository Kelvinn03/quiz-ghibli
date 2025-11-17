import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
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

    const review = await prisma.review.create({
      data: {
        filmTitle,
        personalRating,
        reviewNotes,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create review." },
      { status: 500 }
    );
  }
}
