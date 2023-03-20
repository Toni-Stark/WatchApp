package com.cqqgsafe.watch.opensettings;
import android.app.Activity;
import android.content.Intent;
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

  }

  /* constructor */
  public OpenSettingsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }
}