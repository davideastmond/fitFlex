import { profileUpdateValidator } from "@/app/validators/user/profile/profile-update-validator";
import { UserRepository } from "@/schemas/user.schema";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/auth-options";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requestBody = await req.json();

  try {
    await profileUpdateValidator.validate(requestBody, { abortEarly: false });
  } catch (e: any) {
    return NextResponse.json(e, { status: 400 });
  }

  const { username, password } = requestBody;
  const user = await UserRepository.findById(session.user?._id);

  if (user) {
    if (username) {
      user.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  }

  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
