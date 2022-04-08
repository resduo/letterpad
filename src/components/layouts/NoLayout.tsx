import React from "react";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { useLetterpadSession } from "@/hooks/useLetterpadSession";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { SessionData } from "@/graphql/types";
import ThemeSwitcher from "../theme-switcher";

interface IProps {
  render: ({
    settings,
    session,
  }: {
    settings: SettingsFragmentFragment;
    session: SessionData;
  }) => React.ReactChild;
}

const AuthenticatedNoLayout = ({ render }: IProps) => {
  const { data, loading } = useSettingsQuery();
  const session = useLetterpadSession();
  useErrorReporting(session?.user);

  React.useEffect(() => {
    ThemeSwitcher.switch(localStorage.theme);
  }, []);

  if (!session) return null;
  if (loading) return null;
  if (data?.settings.__typename !== "Setting") return null;

  const { settings } = data;

  return <div>{render({ settings, session: session.user })}</div>;
};

export default AuthenticatedNoLayout;