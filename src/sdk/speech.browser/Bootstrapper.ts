/// <reference path="..\..\common\Storage.ts" />
/// <reference path="..\..\common\Events.ts" />
/// <reference path="..\..\common.browser\LocalStorage.ts" />
/// <reference path="..\..\common.browser\SessionStorage.ts" />
/// <reference path="..\..\common.browser\ConsoleLoggingListener.ts" />

// Common.Storage.SetLocalStorage(new Common.Browser.LocalStorage());
// Common.Storage.SetSessionStorage(new Common.Browser.SessionStorage());
Common.Events.Instance.AttachListener(new Common.Browser.ConsoleLoggingListener());
