import { Avatar, Style } from "@dicebear/core";
import definition from '@dicebear/styles/lorelei-neutral.json' with { type: 'json' };

const avatarStyle = new Style(definition);

export const generateAvatar = (userName: string): string => {
    const avatar = new Avatar(avatarStyle,{
            seed: userName
        }).toDataUri();
        return avatar;
}

