import { ThreeDots } from './ThreeDots';
import { ProfileStatus } from './profiles';
import Pluralchum from './singleton';
import React from '@moonlight-mod/wp/react';
import MessageClasses from '@moonlight-mod/wp/discord/modules/messages/web/Message.css';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';

const botTagClasses = Object.values(spacepack.findByCode(':"botTagRegular_')[0].exports);
const botTagRegular = botTagClasses.find((x): x is string => typeof x === 'string' && x.startsWith('botTagRegular_'));
const botText = botTagClasses.find((x): x is string => typeof x === 'string' && x.startsWith('botText_'));
const rem = botTagClasses.find((x): x is string => typeof x === 'string' && x.startsWith('rem_'));

export default function PopoutPKBadge({ userHash, profile }) {
  const status = profile.status;

  const onClick = function () {
    Pluralchum.profileMap.update(userHash, function (profile) {
      profile.status = ProfileStatus.Stale;
      return profile;
    });
  };

  const linkStyle = {
    color: '#ffffff',
  };
  let content: React.ReactNode = 'PK';
  if ([ProfileStatus.Updating, ProfileStatus.Requesting, ProfileStatus.Stale].includes(status)) {
    const dotstyle = {
      height: '.4em',
      width: '100%',
      display: 'inline',
      'vertical-align': 'top',
      'padding-top': '0.55em',
    };
    content = <ThreeDots style={dotstyle} />;
  }

  return (
    <span className={`${MessageClasses.botTagCozy} ${MessageClasses.botTag} ${botTagRegular} ${rem}`}>
      <div className={botText}>
        <a style={linkStyle} onClick={onClick}>
          {content}
        </a>
      </div>
    </span>
  );
}
