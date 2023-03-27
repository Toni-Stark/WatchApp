package com.cqqgsafe.watch.opensettings;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.ComponentName;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class OpenSettingsSystem extends ReactContextBaseJavaModule {
    @Override
    public String getName() {
        /**
         * return the string name of the NativeModule which represents this class in JavaScript
         * In JS access this module through React.NativeModules.OpenSettings
         */
        return "OpenSystem";
    }
    @ReactMethod
    public void enterBatterySetting(Callback cb){
        Activity currentActivity = getCurrentActivity();
        try {
            currentActivity.startActivity(getBatteryIntent());
        }catch (Exception e){
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
        }
    }
   @ReactMethod
    public void enterTaskSetting(Callback cb){
        Activity currentActivity = getCurrentActivity();
        try {
            currentActivity.startActivity(getTaskSetting());
        }catch (Exception e){
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
        }
    }
   @ReactMethod
    public void enterSelfSetting(Callback cb){
        Activity currentActivity = getCurrentActivity();
        try {
        ComponentName componentName = null;
            String brand = android.os.Build.BRAND;
            switch (brand.toLowerCase()){
                case "samsung":
                    componentName = new ComponentName("com.samsung.android.sm","com.samsung.android.sm.app.dashboard.SmartManagerDashBoardActivity");
                break;
                case "huawei":
                    componentName = new ComponentName("com.huawei.systemmanager","com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity");
                break;
                case "xiaomi":
                    componentName = new ComponentName("com.miui.securitycenter","com.miui.permcenter.autostart.AutoStartManagementActivity");
                break;
                case "vivo":
                    componentName = new ComponentName(" com.iqoo.secure","com.iqoo.secure/.MainActivity");
                break;
                case "OPPO":
                    componentName = ComponentName.unflattenFromString("com.coloros.phonemanager/.FakeActivity");
                break;
                case "360":
                    componentName = new ComponentName("com.yulong.android.coolsafe","com.yulong.android.coolsafe.ui.activity.autorun.AutoRunListActivity");
                break;
                case "meizu":
                    componentName = new ComponentName("com.meizu.safe","com.meizu.safe.permission.SmartBGActivity");
                break;
                case "oneplus":
                    componentName = new ComponentName("com.oneplus.security","com.oneplus.security.chainlaunch.view.ChainLaunchAppListActivity");
                break;
                default:
                break;
            }
            Intent intent = new Intent();
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            if(componentName!=null){
                intent.setComponent(componentName);
            }else{
                intent.setAction(android.provider.Settings.ACTION_SETTINGS);
            }
            currentActivity.startActivity(intent);
        }catch (Exception e){
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
        }
    }
    @ReactMethod
    public void openNetworkSettings(Callback cb) {
        Activity currentActivity = getCurrentActivity();
        Intent i = new Intent();
        if (currentActivity == null) {
            cb.invoke(false);
            return;
        }
        try {
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS));
            cb.invoke(true);
        } catch (Exception e) {
            cb.invoke(e.getMessage());
        }
    }
    @ReactMethod
    private Intent getBatteryIntent(){
        ComponentName componentName = null;
        String brand = android.os.Build.BRAND;
          System.out.println("———vivo-data———");
          System.out.println(brand);
          System.out.println("———vivo-data———");
        switch (brand.toLowerCase()){
            case "samsung":
                componentName = new ComponentName("com.samsung.android.sm","com.samsung.android.sm.app.dashboard.SmartManagerDashBoardActivity");
            break;
            case "huawei":
                componentName = new ComponentName("com.huawei.systemmanager","com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity");
            break;
            case "xiaomi":
                componentName = new ComponentName("com.miui.securitycenter","com.miui.permcenter.autostart.AutoStartManagementActivity");
            break;
            case "vivo":
                componentName = new ComponentName("com.iqoo.powersaving","com.iqoo.powersaving.PowerSavingManagerActivity");
            break;
            case "OPPO":
                componentName = ComponentName.unflattenFromString("com.oppo.safe/.permission.startup.StartupAppListActivity");
            break;
            case "360":
                componentName = new ComponentName("com.yulong.android.coolsafe","com.yulong.android.coolsafe.ui.activity.autorun.AutoRunListActivity");
            break;
            case "meizu":
                componentName = new ComponentName("com.meizu.safe","com.meizu.safe.permission.SmartBGActivity");
            break;
            case "oneplus":
                componentName = new ComponentName("com.oneplus.security","com.oneplus.security.chainlaunch.view.ChainLaunchAppListActivity");
            break;
            default:
            break;
        }
        Intent intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if(componentName!=null){
            intent.setComponent(componentName);
        }else{
            intent.setAction(android.provider.Settings.ACTION_SETTINGS);
        }
        return intent;
    }
    @ReactMethod
    private Intent getTaskSetting(){
        ComponentName componentName = null;
        String brand = android.os.Build.BRAND;
          System.out.println("———vivo-data———");
          System.out.println(brand);
          System.out.println("———vivo-data———");
        switch (brand.toLowerCase()){
            case "samsung":
                componentName = new ComponentName("com.samsung.android.sm","com.samsung.android.sm.app.dashboard.SmartManagerDashBoardActivity");
            break;
            case "huawei":
                componentName = new ComponentName("com.huawei.systemmanager","com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity");
            break;
            case "xiaomi":
                componentName = new ComponentName("com.miui.securitycenter","com.miui.permcenter.autostart.AutoStartManagementActivity");
            break;
            case "vivo":
                componentName = new ComponentName("com.android.systemui","com.vivo.systemui.statusbar.notification.settings.StatusbarSettingActivity");
            break;
            case "OPPO":
                componentName = ComponentName.unflattenFromString("com.coloros.phonemanager/.FakeActivity");
            break;
            case "360":
                componentName = new ComponentName("com.yulong.android.coolsafe","com.yulong.android.coolsafe.ui.activity.autorun.AutoRunListActivity");
            break;
            case "meizu":
                componentName = new ComponentName("com.meizu.safe","com.meizu.safe.permission.SmartBGActivity");
            break;
            case "oneplus":
                componentName = new ComponentName("com.oneplus.security","com.oneplus.security.chainlaunch.view.ChainLaunchAppListActivity");
            break;
            default:
            break;
        }
        Intent intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if(componentName!=null){
            intent.setComponent(componentName);
        }else{
            intent.setAction(android.provider.Settings.ACTION_SETTINGS);
        }
        return intent;
    }
    public OpenSettingsSystem(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}
