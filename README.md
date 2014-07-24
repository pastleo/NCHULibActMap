興圖世界網頁內容更動方法說明
======

本網站使用 Google 試算表作為後台，把 `index.htm` 中的來源修改就可以了，如下：

```
// ====================================
// json source url: (see here to see how to get one: https://coderwall.com/p/duapqq)
var acts_json_url="https://spreadsheets.google.com/feeds/list/<input_google_sheet_code_here>/od6/public/values?alt=json";
// ====================================
```

如果日後有機會可能會把 img 和資料剝除 open source 出去吧
