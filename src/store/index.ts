import { createContext, useContext } from 'react';
import { UserStore } from './UserStore';
import { SystemStore } from './SystemStore';
import { SettingStore } from './SettingStore';
import { BlueToothStore } from './BlueToothStore';
import { WeChatStore } from './WeChatStore';
import { RSJournalStore } from './RSJournalStore';

const StoreContext = createContext({
  userStore: new UserStore(),
  systemStore: new SystemStore(),
  settingStore: new SettingStore(),
  blueToothStore: new BlueToothStore(),
  weChatStore: new WeChatStore(),
  journalStore: new RSJournalStore()
});

export const useStore = () => useContext(StoreContext);
