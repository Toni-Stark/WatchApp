import { ScreenList } from '../index';
import { Register } from './Register';
import { LoginByScan } from './LoginByScan';
import { UserAgreement } from './UserAgreement';
import { noPhoneRegister } from './noPhoneRegister';

export const ModalScreens: Array<ScreenList> = [
  { name: 'LoginByScan', component: LoginByScan },
  { name: 'Register', component: Register },
  { name: 'noPhoneRegister', component: noPhoneRegister },
  { name: 'UserAgreement', component: UserAgreement }
];
