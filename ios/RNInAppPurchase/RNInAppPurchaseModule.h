//
//  RNInAppPurchaseModule.h
//  watch.app
//
//  Created by LiHao on 2020/4/29.
//  Copyright © 2020 com.watch.app. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <StoreKit/StoreKit.h>

@interface RNInAppPurchaseModule : NSObject <RCTBridgeModule, SKPaymentTransactionObserver, SKProductsRequestDelegate>

@end
