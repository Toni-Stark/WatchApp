import { ScreenList } from '../index';
import { LoginByPhone } from './LoginByPhone';
import { Register } from './Register';
import { LoginByName } from './LoginByName';
import { LoginByScan } from './LoginByScan';
import { UserAgreement } from './UserAgreement';
import { noPhoneRegister } from './noPhoneRegister';

export const ModalScreens: Array<ScreenList> = [
  { name: 'LoginByPhone', component: LoginByPhone },
  { name: 'LoginByName', component: LoginByName },
  { name: 'LoginByScan', component: LoginByScan },
  { name: 'Register', component: Register },
  { name: 'noPhoneRegister', component: noPhoneRegister },
  { name: 'UserAgreement', component: UserAgreement }
];
