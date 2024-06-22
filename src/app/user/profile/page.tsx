"use client";
import { UserClient } from "@/app/clients/user-client/user-client";
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
  const router = useRouter();

  useEffect(() => {
    setUserNameFieldValue(session?.user?.username!);
  }, [session?.user?.username]);

  const handleSaveUserInfo = async () => {
    setErrorMessage(null);
    if (!userNameFieldValue || userNameFieldValue.trim() === "") {
      setErrorMessage("The username field can't be empty.");
      return;
    }
    setIsBusy(true);
    try {
      await UserClient.updateUserInfo({ username: userNameFieldValue });
      setSuccessModalOpen(true);
      if (update) {
        update();
      }
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
        <div>
          <h1 className="text-lg mb-2 text-stone-500">My Name</h1>
          <input
            type="text"
            id="templateName"
            maxLength={50}
            autoComplete="off"
            value={userNameFieldValue}
            onChange={(e) => setUserNameFieldValue(e.target.value)}
            placeholder="Enter a user name"
            className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300"
            disabled={isBusy}
          />
        </div>
        <div className="mt-2">
          <h1 className="text-lg mb-2 text-stone-500">My E-mail Address</h1>
          <p className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300 content-center">
            {session?.user?.email}
          </p>
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
              (session?.user?.username === userNameFieldValue &&
                userNameFieldValue?.trim() !== "")
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
