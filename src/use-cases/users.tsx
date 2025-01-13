import { applicationName } from "@/app-config";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from "@/data-access/users";
import { UserId, UserSession } from "@/use-cases/types";
import {
  createAccount,
  createAccountViaGithub,
  createAccountViaGoogle,
  updatePassword,
} from "@/data-access/accounts";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "@/data-access/profiles";
import { emailSender } from "@/lib/send-email";
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
} from "@/data-access/reset-token";
import { ResetPasswordEmail } from "@/emails/reset-password";
import {
  createVerifyEmailOtp,
  deleteverifyEmailOtps,
  deleteVerifyEmailToken,
  getVerifyEmailOtps,
  getVerifyEmailToken,
} from "@/data-access/verify-email";
import { createTransaction } from "@/data-access/utils";
import { LoginError, PublicError, TokenExpiredError } from "@/lib/errors";
import { deleteSessionForUser } from "@/data-access/sessions";
import { render } from "@react-email/components";
import { VerifyEmailOTP } from "@/emails/verify-email-otp";
import { GitHubUser, GoogleUser } from "@/types/auth";

export async function getUserUseCase(userId: number) {
  const user = await getUser(userId);
  return user;
}

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId,
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new PublicError("You can only delete your own account");
  }

  await deleteUser(userToDeleteId);
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new PublicError("User not found");
  }

  return profile;
}

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.emailVerified) {
    throw new PublicError("Email already verified");
  }

  if (existingUser && !existingUser.emailVerified) {
    try {
      const otp = await createVerifyEmailOtp(existingUser.id);

      const emailHtml = await render(<VerifyEmailOTP otp={otp} />);

      await emailSender({
        email,
        subject: `Verify your email for ${applicationName}`,
        body: emailHtml,
      });
    } catch (error) {
      console.error("Verification email would not be sent.", error);
    }

    return { id: existingUser.id };
  }

  const user = await createUser(email);
  await createAccount(user.id, password);

  const displayName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  });
  await createProfile(user.id, displayName);

  try {
    const otp = await createVerifyEmailOtp(user.id);

    const emailHtml = await render(<VerifyEmailOTP otp={otp} />);

    await emailSender({
      email,
      subject: `Verify your email for ${applicationName}`,
      body: emailHtml,
    });
  } catch (error) {
    console.error("Verification email would not be sent.", error);
  }

  return { id: user.id };
}

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new LoginError();
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  if (!user.emailVerified) {
    throw new PublicError("Email not verified");
  }

  return { id: user.id };
}

export async function updateProfileImageUseCase(image: string, userId: UserId) {
  await updateProfile(userId, { image });
}

export async function updateProfileBioUseCase(userId: UserId, bio: string) {
  await updateProfile(userId, { bio });
}

export async function updateProfileNameUseCase(
  userId: UserId,
  displayName: string,
) {
  await updateProfile(userId, { displayName });
}

export async function createGithubUserUseCase(githubUser: GitHubUser) {
  let existingUser = await getUserByEmail(githubUser.email);

  if (!existingUser) {
    existingUser = await createUser(githubUser.email);
  }

  await createAccountViaGithub(existingUser.id, githubUser.id);

  await createProfile(existingUser.id, githubUser.login, githubUser.avatar_url);

  return existingUser.id;
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email);
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub);

  await createProfile(existingUser.id, googleUser.name, googleUser.picture);

  return existingUser.id;
}

export async function resetPasswordUseCase(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const token = await createPasswordResetToken(user.id);

  const emailHml = await render(<ResetPasswordEmail token={token} />);

  await emailSender({
    email,
    subject: `Your password reset link for ${applicationName}`,
    body: emailHml,
  });
}

export async function changePasswordUseCase(token: string, password: string) {
  const tokenEntry = await getPasswordResetToken(token);

  if (!tokenEntry || !tokenEntry.tokenExpiresAt) {
    throw new PublicError("Invalid token");
  }

  if (tokenEntry.tokenExpiresAt < new Date()) {
    throw new TokenExpiredError();
  }

  const userId = tokenEntry.userId;

  await createTransaction(async trx => {
    await deletePasswordResetToken(token, trx);
    await updatePassword(userId, password, trx);
    await deleteSessionForUser(userId, trx);
  });
}

export async function verifyEmailTokenUseCase(token: string) {
  const tokenEntry = await getVerifyEmailToken(token);

  if (!tokenEntry) {
    throw new PublicError("Invalid token");
  }

  const userId = tokenEntry.userId;

  await updateUser(userId, { emailVerified: new Date() });
  await deleteVerifyEmailToken(token);
  return userId;
}

export async function verifyEmailOtpUseCase(otp: string) {
  const otpEntry = await getVerifyEmailOtps(otp);

  if (!otpEntry) {
    throw new PublicError("Invalid OTP");
  }

  const userId = otpEntry.userId;

  await updateUser(userId, { emailVerified: new Date() });
  await deleteverifyEmailOtps(otp);
  return userId;
}
