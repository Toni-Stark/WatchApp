import { ScreenList } from '../index';
import { Register } from './Register';
import { LoginByScan } from './LoginByScan';
import { UserAgreement } from './UserAgreement';
import { noPhoneRegister } from './noPhoneRegister';
import { OnePassLogin } from './OnePassLogin';
import { WeChatOnePassLogin } from './WeChatOnePassLogin';

export const ModalScreens: Array<ScreenList> = [
  { name: 'LoginByScan', component: LoginByScan },
  { name: 'Register', component: Register },
  { name: 'noPhoneRegister', component: noPhoneRegister },
  { name: 'UserAgreement', component: UserAgreement },
  { name: 'OnePassLogin', component: OnePassLogin },
  { name: 'WeChatOnePassLogin', component: WeChatOnePassLogin }
];
