"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiTrash, FiX } from "react-icons/fi";
import Switch from "react-switch";
import { LoggingClient } from "../clients/logging-client/logging-client";

interface Exercise {
  id: string;
  label: string;
  sets: Set[];
}

interface Set {
  reps: number;
  weight: number;
}

export default function CreateLog() {
  const { status, session } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any>([]);
  console.log(searchResults);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [unit, setUnit] = useState("lbs");

  const exercisesArray = Object.values(ExercisesDictionary);

  useEffect(() => {
    if (searchInput) {
      const results = exercisesArray.filter((exercise) =>
        exercise.label.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => [
      ...prev,
      { ...exercise, sets: [{ reps: 0, weight: 0 }] },
    ]);
    setSearchInput(""); // Clear search input after selection
    setSearchResults([]); // Clear search results after selection
  };

  const handleAddSet = (index: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[index].sets.push({ reps: 0, weight: 0 });
    setSelectedExercises(newSelectedExercises);
  };

  const handleSetChange = (
    index: number,
    setIndex: number,
    field: keyof Set,
    value: number
  ) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[index].sets[setIndex][field] = value;
    setSelectedExercises(newSelectedExercises);
  };

  const handleDeleteSet = (index: number, setIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    // Remove the set at setIndex from the selected exercise
    newSelectedExercises[index].sets.splice(setIndex, 1);
    setSelectedExercises(newSelectedExercises);
  };

  const handleDeleteExercise = (index: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.splice(index, 1);
    setSelectedExercises(newSelectedExercises);
  };

  const toggleUnit = () => {
    setUnit(unit === "lbs" ? "kg" : "lbs");
  };

  const handleSaveLog = async () => {
    if (session?.user?._id) {
      const sessions = [
        {
          date: new Date(),
          exercises: selectedExercises.map((exercise) => {
            // Map selected exercises to exerciseSchema
            return {
              exerciseName: exercise.label,
              sets: exercise.sets.map((set, index) => {
                // Map sets to setSchema
                return {
                  setNumber: index + 1, // Set number starts from 1
                  weight: set.weight,
                  unit: unit,
                  reps: set.reps,
                };
              }),
            };
          }),
        },
      ];

      await LoggingClient.saveLog({
        userId: session.user._id,
        sessions: sessions,
      });
    }
  };

  if (status === "unauthenticated") {
    router.replace("/signin");
    return null; // Ensure the component does not render until redirection
  }

  return (
    <div className="flex flex-col items-center gap-y-20 justify-center w-screen mt-20 mb-10">
      {/* Header */}
      <h1 className="text-5xl font-bold leading-6 text-center">
        Log Your Workout
      </h1>
      <BasicRoundedButton label="Choose From Templates" />
      <div className="flex items-center">
        <div className="flex-1 w-48 border-t-2"></div>
        <h2 className="text-xl text-gray-500 pl-2 pr-2">
          {" "}
          Or Start Logging By Search{" "}
        </h2>
        <div className="flex-1 w-48 border-t-2"></div>
      </div>

      {/* Search Bar */}
      <div className="relative flex flex-col min-w-80">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for an exercise"
            className="border rounded-xl pl-10 pr-10 p-2 w-full bg-gray-50"
          />
          {searchInput && (
            <FiX
              className="absolute right-3 cursor-pointer"
              onClick={() => setSearchInput("")}
            />
          )}
        </div>
        {searchResults.length > 0 && (
          <div
            className="absolute top-full bg-gray-50 left-0 right-0 flex flex-col border rounded shadow-lg z-10"
            style={{ overflowY: "auto", maxHeight: "200px" }}
          >
            {searchResults.map((exercise: Exercise) => (
              <div
                key={exercise.id}
                onClick={() => handleSelectExercise(exercise)}
                className="cursor-pointer p-2 border-b hover:bg-orange-500 hover:text-white"
              >
                {exercise.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Exercises */}
      <div className="flex flex-col gap-y-9 w-3/4 px-4">
        <div className="flex justify-end gap-2 w-full">
          <div>
            <Switch
              onChange={toggleUnit}
              checked={unit === "kg"}
              onColor="#4CAF50"
              onHandleColor="#fff"
              handleDiameter={24}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 0px rgba(0, 0, 0, 0.1)"
              height={16}
              width={40}
            />
          </div>
          <span>Weighted Unit: {unit === "lbs" ? "lbs" : "kg"}</span>
        </div>
        {selectedExercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="rounded-xl mb-4 border border-gray-100 shadow-md relative"
          >
            <h4 className="text-black font-bold p-2 text-center ">
              {exercise.label}
            </h4>
            <button
              onClick={() => handleDeleteExercise(index)}
              className="absolute top-2 right-2"
            >
              <FiX />
            </button>
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="text-white text-center bg-orange-500">
                  <th className="p-left-2 font-bold">Set</th>
                  <th className="p-2">Reps</th>
                  <th className="p-2">Weight ({unit})</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr key={setIndex} className="odd:bg-orange-100 text-center">
                    <td className="p-2 text-center">{setIndex + 1}</td>
                    <td className="p-2 text-center ">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          handleSetChange(
                            index,
                            setIndex,
                            "reps",
                            Number(e.target.value)
                          )
                        }
                        className="w-3/4 p-1 border rounded-xl text-center bg-gray-50"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          handleSetChange(
                            index,
                            setIndex,
                            "weight",
                            Number(e.target.value)
                          )
                        }
                        className="w-3/4 p-1 border rounded-xl text-center bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      {exercise.sets.length > 1 && ( // Condition to render the delete button
                        <button
                          onClick={() => handleDeleteSet(index, setIndex)}
                          className=" text-red-500"
                        >
                          <FiTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => handleAddSet(index)}
              className="m-2 p-2 border rounded-xl bg-green-500 text-white font-bold hover:bg-green-600"
            >
              <FiPlus />
            </button>
          </div>
        ))}
      </div>
      {/* Save Button */}
      <div className="flex flex-col gap-y-9">
        <BasicRoundedButton
          onClick={handleSaveLog}
          label="Save Your Log"
          disabled={selectedExercises.length === 0}
        ></BasicRoundedButton>
      </div>
    </div>
  );
}