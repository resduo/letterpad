import Twig from "twig";
import path from "path";
import fs from "fs";
import { getToken } from "@/shared/token";

export const bodyDecorator = (
  html: string,
  recipient_email: string,
  unsubscribe = false,
) => {
  const token = getToken(recipient_email, 0);
  const unsubscribeUrl = `${process.env.ROOT_URL}/api/unsubscribe?token=${token}`;

  const baseTemplate = path.resolve(
    process.cwd(),
    "src/mail/templates/base.twig",
  );

  const template = fs.readFileSync(baseTemplate, "utf-8");
  if (!template) {
    throw new Error("Email base template not found in sr/mail");
  }
  const bodyTemplate = Twig.twig({
    data: template.toString(),
  });

  const body = bodyTemplate.render({
    content: html,
    unsubscribe_link: unsubscribe
      ? `
                      Changed your mind about receiving our emails? You can
                      <a target="_blank" href="${unsubscribeUrl}"
                        >Unsubscribe</a
                      > at any time.
                 `
      : "",
  });
  return body;
};
