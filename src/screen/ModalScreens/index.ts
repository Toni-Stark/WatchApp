import { ScreenList } from '../index';
import { LoginByScan } from './LoginByScan';
import { UserAgreement } from './UserAgreement';
import { OnePassLogin } from './OnePassLogin';
import { WeChatOnePassLogin } from './WeChatOnePassLogin';
import { PrivacyAgreement } from './PrivacyAgreement';

export const ModalScreens: Array<ScreenList> = [
  { name: 'WeChatOnePassLogin', component: WeChatOnePassLogin },
  { name: 'LoginByScan', component: LoginByScan },
  { name: 'UserAgreement', component: UserAgreement },
  { name: 'OnePassLogin', component: OnePassLogin },
  { name: 'PrivacyAgreement', component: PrivacyAgreement }
];
export const ModalScreensRoot: Array<ScreenList> = [{ name: 'WeChatRoot', component: WeChatOnePassLogin }];
