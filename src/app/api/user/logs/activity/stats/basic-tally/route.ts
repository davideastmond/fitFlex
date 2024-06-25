import authOptions from "@/app/api/auth/auth-options";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { findExerciseSlugByLabel } from "../../helpers/find-exercise-slug-by-label";

// This stats function shows how frequently a user has done each exercise (regardless of set)
// Most popular exercise by exercise count
export async function GET() {
  const arrayDict = Object.entries(ExercisesDictionary);
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  await dbConnect();
  const user = await UserRepository.findById(session.user?._id);

  if (user) {
    const exercisesTallyCount = user.logs.reduce(
      (acc: Record<string, number>, currentLog) => {
        currentLog.exercises.forEach((exercise) => {
          if (
            !acc[
              findExerciseSlugByLabel(arrayDict, exercise.exerciseName) ||
                "undefinedExercise"
            ]
          ) {
            acc[
              findExerciseSlugByLabel(arrayDict, exercise.exerciseName) ||
                "undefinedExercise"
            ] = 0;
          }
          acc[
            findExerciseSlugByLabel(arrayDict, exercise.exerciseName) ||
              "undefinedExercise"
          ]++;
        });
        return acc;
      },
      {}
    );

    return NextResponse.json(
      {
        data: exercisesTallyCount,
        title: "Most popular exercise by exercise count",
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
