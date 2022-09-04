import {
  BarChartOutlined,
  ContainerOutlined,
  FileImageOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  // UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { FC, useMemo } from "react";

const countStyle = {
  right: 24,
};

export const SidebarMenu = ({ stats }) => {
  const router = useRouter();
  const { pathname } = router;

  const menuItems = useMemo(() => {
    return [
      { key: "/dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
      {
        key: "/posts",
        icon: <ContainerOutlined />,
        label: (
          <ItemLabelWithNumber label="Posts" value={stats?.posts?.published} />
        ),
      },
      {
        key: "/pages",
        icon: <FileTextOutlined />,
        label: (
          <ItemLabelWithNumber label="Pages" value={stats?.pages?.published} />
        ),
      },
      {
        key: "/media",
        icon: <FileImageOutlined />,
        label: <ItemLabelWithNumber label="Media" value={stats?.media} />,
      },

      {
        key: "/tags",
        icon: <TagsOutlined />,
        label: <ItemLabelWithNumber label="Tags" value={stats?.tags} />,
      },
      { key: "/profile", icon: <UserOutlined />, label: "Profile" },
      {
        key: "/domain-mapping",
        icon: <GlobalOutlined />,
        label: "Domain Mapping",
      },
      { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
      // { key: "/migrate", icon: <UploadOutlined />, label: "Migrate" },
      { key: "/subscribers", icon: <TeamOutlined />, label: "Subscribers" },
      {
        key: "/logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => {
          signOut({
            redirect: true,
          });
        },
      },
    ];
  }, [
    stats?.media,
    stats?.pages?.published,
    stats?.posts?.published,
    stats?.tags,
  ]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[menuItems[pathname]]}
      style={{ paddingBottom: 60, background: "none", flex: 1 }}
      items={menuItems}
      onClick={(info) => {
        if (info.key !== "/logout") router.push(info.key);
      }}
    />
  );
};

const ItemLabelWithNumber: FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => {
  return (
    <>
      <span>{label}</span>
      <span style={{ ...countStyle, position: "absolute" }}>{value}</span>
    </>
  );
};
