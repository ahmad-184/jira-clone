import { applicationName } from "@/app-config";
import {
  deleteMagicToken,
  getMagicLinkByToken,
  upsertMagicLink,
} from "@/data-access/magic-links";
import { createProfile } from "@/data-access/profiles";
import {
  createMagicUser,
  getUserByEmail,
  setEmailVerified,
} from "@/data-access/users";
import { MagicLinkEmail } from "@/emails/magic-link";
import { emailSender } from "@/lib/send-email";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { render } from "@react-email/components";
import { PublicError } from "@/lib/errors";

export async function sendMagicLinkUseCase(email: string) {
  const token = await upsertMagicLink(email);

  const emailHtml = await render(<MagicLinkEmail token={token} />);

  await emailSender({
    email,
    subject: `Your magic login link for ${applicationName}`,
    body: emailHtml,
  });
}

export async function loginWithMagicLinkUseCase(token: string) {
  const magicLinkInfo = await getMagicLinkByToken(token);

  if (!magicLinkInfo) {
    throw new PublicError("Invalid or expired magic link");
  }

  if (magicLinkInfo.tokenExpiresAt! < new Date()) {
    throw new PublicError("This magic link has expired");
  }

  const existingUser = await getUserByEmail(magicLinkInfo.email);

  if (existingUser) {
    await setEmailVerified(existingUser.id);
    await deleteMagicToken(token);
    return existingUser;
  } else {
    const newUser = await createMagicUser(magicLinkInfo.email);
    const displayName = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: " ",
      style: "capital",
    });
    await createProfile(newUser.id, displayName);
    await deleteMagicToken(token);
    return newUser;
  }
}
