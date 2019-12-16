package com.be4goapp;
import com.swmansion.reanimated.ReanimatedPackage;
import com.rnfs.RNFSPackage;
import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.react.shell.MainReactPackage;
 import java.util.Arrays;
 import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }
      private  CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected  CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
        @Override
        protected List<ReactPackage> getPackages() {
         return Arrays.asList(
    new MainReactPackage(),
            new FBSDKPackage(),
    new ReactNativeFirebaseMessagingPackage(),
    new RNGestureHandlerPackage(),
    new ReanimatedPackage(),
    new RNFSPackage(),
    new RNGoogleSigninPackage(),
    new ReactNativeFirebaseAppPackage(),
    new PickerPackage()
    );
    }
        
   
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };
  
  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
  
}
