// NavigationService.js
import { CommonActions } from '@react-navigation/native';

let navigator;

export function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

export function navigate(name, params) {
  if (navigator) {
    navigator.dispatch(
      CommonActions.navigate({
        name,
        params,
      })
    );
  }
}

export function goBack() {
  if (navigator) {
    navigator.dispatch(CommonActions.goBack());
  }
}

// 其他导航函数...
