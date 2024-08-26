import { Resend } from "resend";
import { v4 as uuid } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export async function send({
  email,
  subject,
  react,
  to = [email],
  from = process.env.RESEND_EMAIL_FROM ??
    `Kayle <noreply@hey.kayle.ai>`,
  preventThreading = true,
}: {
  email: string;
  subject: string;
  react: React.ReactElement;
  to?: string[];
  from?: string;
  preventThreading?: boolean;
}) {
  try {
    await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      react: react,
      headers: {
        ...(preventThreading ? { "X-Entity-Ref-ID": uuid() } : {}),
      },
    });

    return;
  } catch (error) {
    console.error(error);
    return;
  }
}
