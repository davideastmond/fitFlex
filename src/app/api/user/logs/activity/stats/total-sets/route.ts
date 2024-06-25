import authOptions from "@/app/api/auth/auth-options";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { findExerciseSlugByLabel } from "../../helpers/find-exercise-slug-by-label";

// This is going to return the number of sets that have been completed for each exercise done
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
                exercise.exerciseName
            ]
          ) {
            acc[
              findExerciseSlugByLabel(arrayDict, exercise.exerciseName) ||
                exercise.exerciseName
            ] = 0;
          }
          acc[
            findExerciseSlugByLabel(arrayDict, exercise.exerciseName) ||
              exercise.exerciseName
          ] += exercise.sets.length;
        });
        return acc;
      },
      {}
    );

    return NextResponse.json(
      {
        data: exercisesTallyCount,
        title: "Number of sets that have been completed for each exercise done",
      },
      { status: 200 }
    );
  }
}
