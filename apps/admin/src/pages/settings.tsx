import { Col, Form, Popconfirm, Row, Typography } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";

import { CopyToClipboard } from "@/components/clipboard";
import Appearance from "@/components/settings/appearance";
import General from "@/components/settings/general";
import Integrations from "@/components/settings/integrations";
import Navigation from "@/components/settings/navigation";
import Pages from "@/components/settings/pages";
import { Accordion } from "@/components_v2/accordion";
import { Buttonv2 } from "@/components_v2/button";
import { Content } from "@/components_v2/content";
import { PageHeader } from "@/components_v2/page-header";
import { TextArea } from "@/components_v2/textarea";

import { useDeleteAuthorMutation } from "@/__generated__/queries/mutations.graphql";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

import { PageProps } from "@/types";

interface Props extends PageProps {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
}
function Settings({ settings, cloudinaryEnabledByAdmin }: Props) {
  const router = useRouter();
  const onPanelClick = (key) => {
    router.replace({ query: { selected: key } });
  };
  const [deleteAuthor] = useDeleteAuthorMutation();
  const confirm = async () => {
    await deleteAuthor();
    router.push("/login?deleted=true");
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <PageHeader className="site-page-header" title="Settings">
        <span className="help-text">
          Here you can customize your blog&apos;s settings.
        </span>
      </PageHeader>
      <Content>
        <Accordion onChange={onPanelClick} activeKey={router.query.selected}>
          <Accordion.Item label="General Settings" id="general">
            <General settings={settings} />
          </Accordion.Item>
          <Accordion.Item label="Appearance" id="appearance">
            <Appearance settings={settings} />
          </Accordion.Item>
          <Accordion.Item label="Pages" id="pages">
            <Pages settings={settings} />
          </Accordion.Item>
          <Accordion.Item label="Navigation" id="navigation">
            <div className="pb-8 dark:text-gray-300">
              Configure the navigation menu of your blog. The first item in the
              navigation menu will be the homepage of your blog.
            </div>
            <Navigation settings={settings} />
          </Accordion.Item>
          <Accordion.Item label="Integrations" id="integrations">
            <Integrations
              settings={settings}
              cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
            />
          </Accordion.Item>
          <Accordion.Item label="Keys" id="keys">
            <div className="mb-8 flex flex-1 items-center">
              <TextArea
                label="Client Key"
                value={settings.client_token}
                id="client_token"
                rows={3}
                className="w-96"
              />
              <CopyToClipboard elementId="client_token" />
            </div>
          </Accordion.Item>
          <Accordion.Item label="Delete your account" id="account">
            <Form.Item>
              <Typography.Text type="secondary">
                If due to some reason you wish to move out of Letterpad, you may
                delete your account. All data will be deleted and you will not
                be able to recover it. You will be logged out after this action.
              </Typography.Text>
            </Form.Item>
            <Form.Item>
              <Row>
                <Col span={18}>
                  <Popconfirm
                    title="Are you sure you want to delete your account ?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Buttonv2 variant="danger">Delete your account</Buttonv2>
                  </Popconfirm>
                </Col>
              </Row>
            </Form.Item>
          </Accordion.Item>
        </Accordion>
      </Content>
    </>
  );
}

export default Settings;

export async function getServerSideProps(context) {
  return {
    props: {
      cloudinaryEnabledByAdmin: !!(
        process.env.CLOUDINARY_KEY &&
        process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_SECRET
      ),
    },
  };
}
