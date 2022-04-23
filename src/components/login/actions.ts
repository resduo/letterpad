import { message } from "antd";
import { basePath } from "@/constants";
import { signIn } from "next-auth/react";
import {
  ForgotPasswordDocument,
  ForgotPasswordMutation,
} from "@/graphql/queries/mutations.graphql";
import { ForgotPasswordMutationVariables } from "@/graphql/queries/mutations.graphql";
import { key } from "./constants";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

type LoginResult = {
  success: boolean;
  message: string;
  redirectUrl?: string;
};

export const doLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  message.loading({ content: "Please wait...", key });
  const result = await signIn("credentials", {
    redirect: false,
    password: password,
    email: email,
    callbackUrl: basePath + "/posts",
  });

  if (result && result["error"]) {
    return {
      success: false,
      message: "Invalid credentials. Please check your email and password.",
    };
  }
  if (result && result["ok"]) {
    return {
      success: true,
      message: "Verified",
      redirectUrl:
        result && result["url"] ? result["url"] : basePath + "/posts",
    };
  }
  return {
    success: false,
    message: "Something wrong happened.",
  };
};

export const forgotPasswordAction = async (email: string) => {
  const sanitisedLoginEmail = email.trim();
  if (sanitisedLoginEmail.length > 0) {
    const res = await apolloBrowserClient.mutate<
      ForgotPasswordMutation,
      ForgotPasswordMutationVariables
    >({
      mutation: ForgotPasswordDocument,
      variables: {
        email: email,
      },
    });
    const data = res.data?.forgotPassword;

    if (data?.ok) {
      message.success("Check your email to reset your password!");
      return true;
    } else {
      message.warn(
        data?.message || "Something wrong hapenned. Please try again.",
      );
    }
  } else {
    message.warn("Email field is mandatory");
  }
  return false;
};
