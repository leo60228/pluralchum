import React from '@moonlight-mod/wp/react';
import Blocked from './blocked.svg';
import Ignored from './ignored.svg';
import HelpMessageClasses from '@moonlight-mod/wp/discord/components/common/HelpMessage.css';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import MessageClasses from '@moonlight-mod/wp/discord/modules/messages/web/Message.css';

const findClasses = pattern =>
  Object.fromEntries(
    Object.values(spacepack.findByCode(`:"${pattern}_`)[0].exports).map(
      x => typeof x === 'string' && [x.split('_')[0], x],
    ),
  );

const blockedMessageClasses = findClasses('blockedMessageText');
const messageGroupClasses = findClasses('groupStart');
const iconClasses = findClasses('actionAnchor');
const messageListClasses = findClasses('messageListItem');

export const Reason = {
  Blocked: 'BLOCKED',
  Ignored: 'IGNORED',
};

export function useUnblocked(unblockedMap, groupId) {
  const [unblocked, setUnblocked] = React.useState(unblockedMap.get(groupId) ?? []);

  unblockedMap.addListener(function (key, value) {
    if (key === groupId) {
      setUnblocked(value);
    }
  });

  const result: any[] = [[...unblocked], setUnblocked];
  return result;
}

function getUnblocked(unblockedMap, message, messageNode, groupId) {
  const [unblocked] = useUnblocked(unblockedMap, groupId);

  if (!unblocked.find(({ id }) => id === message.id)) {
    unblocked.push({ id: message.id, node: messageNode, timestamp: message.timestamp });
    unblocked.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
    unblockedMap.set(groupId, unblocked);
  }

  return unblocked.map(({ node }) => node);
}

function HiddenIcon({ reason }) {
  return (
    <div className={(HelpMessageClasses as any).iconContainer}>
      {reason === Reason.Blocked ? (
        <Blocked aria-hidden='true' role='img' className={blockedMessageClasses.blockedIcon} />
      ) : reason === Reason.Ignored ? (
        <Ignored aria-hidden='true' role='img' className={blockedMessageClasses.blockedIcon} />
      ) : null}
    </div>
  );
}

export function HiddenMessage({ unblockedMap, message, messageNode, groupId, reason }) {
  const [expanded, setExpanded] = React.useState(false);
  const unblocked = getUnblocked(unblockedMap, message, messageNode, groupId);

  if (message.id !== groupId) {
    return null;
  }

  return (
    <div className={`${messageGroupClasses.groupStart} ${expanded ? blockedMessageClasses.expandedClass : ''}`}>
      <div
        className={`${messageGroupClasses.wrapper} ${messageGroupClasses.cozy} ${messageGroupClasses.zalgo}`}
        role='article'
      >
        <div className={MessageClasses.contents}>
          <div className={`${blockedMessageClasses.blockedSystemMessage} ${iconClasses.container} ${iconClasses.cozy}`}>
            <HiddenIcon reason={reason} />
            <div className={iconClasses.content}>
              <div className={blockedMessageClasses.blockedMessageText}>
                {unblocked.length} {reason === Reason.Blocked ? 'blocked' : 'ignored'}{' '}
                {unblocked.length === 1 ? 'message' : 'messages'} —{' '}
                <span
                  className={blockedMessageClasses.blockedIcon}
                  role='button'
                  tabIndex={0}
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {expanded ? (
        <li
          id={`chat-messages-${message.channel_id}-${message.id}`}
          className={messageListClasses.messageListItem}
          aria-setsize={-1}
        >
          {unblocked}
        </li>
      ) : null}
    </div>
  );
}
