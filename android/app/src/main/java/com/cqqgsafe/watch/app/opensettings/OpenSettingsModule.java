package com.cqqgsafe.watch.opensettings;
import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.os.Build;
import android.net.Uri;
import android.content.ComponentName;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class OpenSettingsModule extends ReactContextBaseJavaModule {

  @Override
  public String getName() {
    /**
     * return the string name of the NativeModule which represents this class in JavaScript
     * In JS access this module through React.NativeModules.OpenSettings
     */
    return "OpenSettings";
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
  public void openBatterySettings(Callback cb) {
    Activity currentActivity = getCurrentActivity();
    Intent i = new Intent();
    if (currentActivity == null) {
        cb.invoke(false);
        return;
    }
    try {
        currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS ));
        cb.invoke(true);
    } catch (Exception e) {
        cb.invoke(e.getMessage());
    }
  }
  @ReactMethod
  public void openNotificationSettings(Callback cb) {
    Activity currentActivity = getCurrentActivity();
    Intent i = new Intent();
    if (currentActivity == null) {
        cb.invoke(false);
        return;
    }
    try {
        currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_APP_NOTIFICATION_BUBBLE_SETTINGS ));
        cb.invoke(true);
    } catch (Exception e) {
        cb.invoke(e.getMessage());
    }
  }
  @ReactMethod
  public void openBackgroundSettings(Callback cb) {
    Activity currentActivity = getCurrentActivity();
    Intent i = new Intent();
    if (currentActivity == null) {
        cb.invoke(false);
        return;
    }
    try {
        currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_IGNORE_BACKGROUND_DATA_RESTRICTIONS_SETTINGS ));
        cb.invoke(true);
    } catch (Exception e) {
        cb.invoke(e.getMessage());
    }
  }
//  @ReactMethod public void getAppDetailSettingIntent(Context context){
//    Intent intent = new Intent();
//    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//    if(Build.VERSION.SDK_INT >= 9){
//     intent.setAction(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
//     intent.setData(Uri.fromParts("package", context.getPackageName(), null));
//    } else {
//     intent.setAction(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
//     intent.setData(Uri.parse("package:" + context.getPackageName()));
//    }
//    context.startActivity(intent);
//  }
  /* constructor */
  public OpenSettingsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }
}