import {Location} from "../../generated/graphql";
import {ImageSource} from "../../utils/types";

export interface EditProfileFormValues {
  [key: string]: any;
  username?: string;
  email?: string;
  location?: Location;
  profileImage?: ImageSource;
}
