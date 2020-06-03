import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { MESSAGES_TYPES } from 'constants';
import { Image, Message, Buttons } from 'messagesComponents';
import { showTooltip as showTooltipAction } from 'actions';
import openLauncher from 'assets/launcher_button.svg';
import closeIcon from 'assets/clear-button-grey.svg';
import Badge from './components/Badge';

import './style.scss';


const Launcher = ({
  toggle,
  isChatOpen,
  badge,
  fullScreenMode,
  openLauncherImage,
  unreadCount,
  displayUnreadCount,
  showTooltip,
  lastMessage,
  closeTooltip
}) => {
  const className = ['rw-launcher'];
  if (isChatOpen) className.push('rw-hide-sm');
  if (fullScreenMode && isChatOpen) className.push('rw-full-screen rw-hide');


  const getComponentToRender = (message) => {
    const ComponentToRender = (() => {
      switch (message.get('type')) {
        case MESSAGES_TYPES.TEXT: {
          return Message;
        }
        case MESSAGES_TYPES.IMGREPLY.IMAGE: {
          return Image;
        }
        case MESSAGES_TYPES.BUTTONS: {
          return Buttons;
        }
        default:
          return null;
      }
    })();
    return <ComponentToRender id={-1} params={{}} message={message} isLast />;
  };


  const renderToolTip = () => (
    <div className="rw-tooltip-body">
      <div className="rw-tooltip-close" >
        <button onClick={(e) => { e.stopPropagation(); closeTooltip(); }}>
          <img
            src={closeIcon}
            alt="close"
          />
        </button>
      </div>
      <div className="rw-tooltip-response">
        {getComponentToRender(lastMessage)}
      </div>
      <div className="rw-tooltip-decoration" />
    </div>
  );

  const renderOpenLauncherImage = () => (
    <div className="rw-open-launcher__container">
      {unreadCount > 0 && displayUnreadCount && (
        <div className="rw-unread-count-pastille">{unreadCount}</div>
      )}
      <img src={openLauncherImage || openLauncher} className="rw-open-launcher" alt="" />
      {showTooltip && lastMessage.get('sender') === 'response' && renderToolTip()}
    </div>
  );

  if (!isChatOpen) {
    return (
      <button type="button" className={className.join(' ')} onClick={toggle}>
        <Badge badge={badge} />
        {renderOpenLauncherImage()}
      </button>
    );
  }

  return <div />;
};

Launcher.propTypes = {
  toggle: PropTypes.func,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  fullScreenMode: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  unreadCount: PropTypes.number,
  displayUnreadCount: PropTypes.bool,
  showTooltip: PropTypes.bool,
  lastMessage: ImmutablePropTypes.map
};

const mapStateToProps = state => ({
  lastMessage: (state.messages && state.messages.get(-1)) || new Map(),
  unreadCount: state.behavior.get('unreadCount') || 0,
  showTooltip: state.metadata.get('showTooltip'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  closeTooltip: () => dispatch(showTooltipAction(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);
