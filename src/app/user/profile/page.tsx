"use client";
import { UserClient } from "@/app/clients/user-client/user-client";
import { passwordValidator } from "@/app/validators/password/password.validator";
import { extractValidationErrors } from "@/app/validators/utils/extract-validation-errors/extract-validation-errors";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import SuccessModal from "@/components/modals/SuccessModal";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

export default function ProfilePage() {
  const { session, status, update } = useAuthSession();
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [userNameFieldValue, setUserNameFieldValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [password1FieldValue, setPassword1FieldValue] = useState<string>("");
  const [password2FieldValue, setPassword2FieldValue] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setUserNameFieldValue(session?.user?.username!);
  }, [session?.user?.username]);

  const handleSaveUserInfo = async () => {
    let fieldsToUpdate: Record<string, string> = {};

    setErrorMessage(null);
    if (!userNameFieldValue || userNameFieldValue.trim() === "") {
      setErrorMessage("The username field can't be empty.");
      return;
    }

    if (
      password1FieldValue.trim().length > 0 ||
      password2FieldValue.trim().length > 0
    ) {
      try {
        await passwordValidator.validate(
          {
            password1: password1FieldValue,
            password2: password2FieldValue,
          },
          { abortEarly: false }
        );
        fieldsToUpdate = {
          password: password1FieldValue,
        };
      } catch (error: any) {
        const passwordErrors = extractValidationErrors(error);
        setErrorMessage(
          Object.values(passwordErrors)
            .map((error) => error.message)
            .join(" ")
        );
        return;
      }
    }

    setIsBusy(true);
    fieldsToUpdate = {
      ...fieldsToUpdate,
      username: userNameFieldValue,
    };

    try {
      await UserClient.updateUserInfo(fieldsToUpdate);
      setSuccessModalOpen(true);
      if (update) {
        update();
      }
      setPassword1FieldValue("");
      setPassword2FieldValue("");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  if (status === "unauthenticated") {
    router.replace("/signin");
    return null;
  }

  return (
    <div className="flex flex-col gap-y-10 justify-center w-screen mt-4 p-4 xl:w-1280">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between"
      >
        <h1 className="text-2xl font-bold openSansFont uppercase self-center">
          My Profile
        </h1>
        <Link href="/user/home">
          <button>
            <FiX className="size-12 text-white blueGray rounded-full ml-2 p-2 hover:bg-stone-500" />
          </button>
        </Link>
      </motion.div>
      <div className="w-full">
        {session?.user?.oAuth && (
          <div>
            <h1 className="mt-4 text-center text-md  openSansFont self-center text-blue-600">
              Note: these values are not editable because you signed with a 3rd
              party provider.
            </h1>
          </div>
        )}
        <div className="mt-4">
          <h1 className="text-lg mb-2 text-stone-500">My E-mail Address</h1>
          <p className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300 content-center">
            {session?.user?.email}
          </p>
        </div>
        <div className="mt-8">
          <h1 className="text-lg mb-2 text-stone-500">My Name</h1>
          <input
            type="text"
            id="username"
            maxLength={50}
            autoComplete="off"
            value={userNameFieldValue}
            onChange={(e) => setUserNameFieldValue(e.target.value)}
            placeholder="Enter a user name"
            className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300"
            disabled={isBusy || session?.user?.oAuth}
          />
        </div>
        {/* Section for user to update their password 
          this section is only visible for credentialed users (non-google oAuth)
        */}
        <div className="mt-8">
          <h1 className="text-lg mb-2 text-stone-500">Update Password</h1>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              id="password1"
              maxLength={50}
              autoComplete="off"
              value={password1FieldValue}
              onChange={(e) => setPassword1FieldValue(e.target.value)}
              placeholder="Enter a new password"
              className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300"
              disabled={isBusy || session?.user?.oAuth}
            />
            <input
              type="password"
              id="password2"
              maxLength={50}
              autoComplete="off"
              value={password2FieldValue}
              onChange={(e) => setPassword2FieldValue(e.target.value)}
              placeholder="Confirm new password"
              className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300"
              disabled={isBusy || session?.user?.oAuth}
            />
          </div>
        </div>
      </div>
      <div>
        {/* Error messages can go here*/}
        {errorMessage && (
          <p className="text-red-500 text-center mt-2">{errorMessage}</p>
        )}
      </div>
      <div>
        {/* Save Button */}
        <motion.div layout className="flex justify-center gap-y-9 mt-8">
          <BasicRoundedButton
            onClick={handleSaveUserInfo}
            label="Update my Info"
            buttonClassNames="defaultButtonColor !justify-evenly"
            disabled={
              isBusy ||
              session?.user?.oAuth ||
              (session?.user?.username === userNameFieldValue &&
                userNameFieldValue?.trim() !== "" &&
                password1FieldValue.trim() !== password2FieldValue.trim())
            }
          >
            {isBusy && <CircularProgress size={30} sx={{ color: "white" }} />}
          </BasicRoundedButton>
        </motion.div>
      </div>
      <SuccessModal
        open={successModalOpen}
        message="You've update your profile successfully."
        buttonActions={
          <>
            <Link href={"/user/home"}>
              <BasicRoundedButton
                label="Return To Home"
                buttonClassNames="whiteButton"
              />
              ,
            </Link>
            <BasicRoundedButton
              label="Close"
              buttonClassNames="defaultButtonColor"
              onClick={() => setSuccessModalOpen(false)}
            />
          </>
        }
      />
    </div>
  );
}
