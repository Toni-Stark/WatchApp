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
    public void enterWhiteListSetting(Callback cb){
        Activity currentActivity = getCurrentActivity();
        try {
            currentActivity.startActivity(getSettingIntent());
        }catch (Exception e){
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
        }
    }
    @ReactMethod
    private Intent getSettingIntent(){
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
                componentName = new ComponentName("com.iqoo.secure","com.iqoo.secure.MainActivity");
            break;
            case "oppo":
                componentName = new ComponentName("com.coloros.oppoguardelf","com.coloros.powermanager.fuelgaue.PowerUsageModelActivity");
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
