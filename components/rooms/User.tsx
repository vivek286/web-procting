import { FC } from "react";
import { UserProfileIface } from "../../shared/UserProfileIface";

interface UserProps {
  data?: UserProfileIface;
}

export const User: FC<UserProps> = ({ data }) => {
  console.log(data,"in user data");
  if (!data) {
    return <>-</>;
  }
  console.log("data form end user",data);
  return (
    <>{`${data.name} (${data.ua.browser.name} v${data.ua.browser.major} on ${
      data.ua.os.name
    } ${data.ua.os.version || "(unknown version)"})`}</>
  );
};
