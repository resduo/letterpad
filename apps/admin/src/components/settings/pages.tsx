import { Checkbox } from "antd";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Divider } from "@/components_v2/divider";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

interface Props {
  settings: SettingsFragmentFragment;
}

const Pages: React.FC<Props> = ({ settings }) => {
  const { updateSettings } = useUpdateSettings();
  return (
    <>
      <Checkbox
        data-testid="aboutPageCb"
        checked={!!settings.show_about_page}
        onChange={(e) => updateSettings({ show_about_page: e.target.checked })}
      >
        Select this to add a new menu item &quot;About&quot; which will display
        information about you.
      </Checkbox>
      <Divider />

      <Checkbox
        checked={!!settings.show_tags_page}
        data-testId="tagsPageCb"
        onChange={(e) => updateSettings({ show_tags_page: e.target.checked })}
      >
        Select this to add a new menu item &quot;Tags&quot; which will display
        all the tags with the post count. <br />
        This will allow users to explore all the collection of posts. <br />
        It is a good idea to enable this after you have written 10+ posts
      </Checkbox>
    </>
  );
};
export default Pages;
