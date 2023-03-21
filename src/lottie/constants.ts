import { StyleSheet } from 'react-native';
import { makeExample } from './utils';

export const EXAMPLES = [
  makeExample('9 squares', () => require('./animations/9squares-AlBoardman.json')),
  makeExample('Hamburger Arrow', () => require('./animations/HamburgerArrow.json')),
  makeExample('Hamburger Arrow (200 px)', () => require('./animations/HamburgerArrow.json'), 200),
  makeExample('Line Animation', () => require('./animations/LineAnimation.json')),
  makeExample('Lottie Logo 1', () => require('./animations/LottieLogo1.json')),
  makeExample('Lottie Logo 2', () => require('./animations/LottieLogo2.json')),
  makeExample('Lottie Walkthrough', () => require('./animations/LottieWalkthrough.json')),
  makeExample('Motion Corpse', () => require('./animations/MotionCorpse-Jrcanest.json')),
  makeExample('Pin Jump', () => require('./animations/PinJump.json')),
  makeExample('Twitter Heart', () => require('./animations/TwitterHeart.json')),
  makeExample('Watermelon', () => require('./animations/Watermelon.json')),
  makeExample('Motion Corpse', () => require('./animations/MotionCorpse-Jrcanest.json')),
  makeExample('Remote load', () => ({
    uri: 'https://raw.githubusercontent.com/lottie-react-native/lottie-react-native/master/apps/paper/src/animations/Watermelon.json'
  }))
];

const PLAY_BUTTON_SIZE = 60;

export const styles = StyleSheet.create({
  controlsIcon: {
    height: 24,
    padding: 8,
    width: 24
  },
  controlsIconDisabled: {
    tintColor: '#aaa'
  },
  controlsIconEnabled: {
    tintColor: '#1d8bf1'
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  lottieView: {
    flex: 1
  },
  lottieViewInvse: {
    backgroundColor: 'black'
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: '#1d8bf1',
    borderRadius: PLAY_BUTTON_SIZE / 2,
    height: PLAY_BUTTON_SIZE,
    justifyContent: 'center',
    width: PLAY_BUTTON_SIZE
  },
  playButtonIcon: {
    height: 16,
    width: 16
  }
});
