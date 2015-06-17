# enevjs
Energieverbrauchs-Scala jQuery Plugin

## Folder
- test = jekyllrb test site
- src = sources

## Description
- Diese Version umfasst Gewerbliche und Nicht-Gewerbliche Skalen. 
- Nicht-Gewerbliche Skala: 0-250, A+ - H
- Gewerbliche Skala: 0-1000

## Options
- value float default 0 required
- isIndustrial boolean default false optional
- nonIndustrialScala array default [scalaMin:0, scalaMax:250, scalaStep:25] required
- industrialScala array default [scalaMin:0, scalaMax:1000, scalaStep:100] required
- arrowWidth int default 15 required
- showAnimation boolean default true optional
- arrowAnimationDuration float default 5000 optional
- classes array default [{label:A+, max:0},{label:A, max:50},{label:B, max:75},{label:C, max:100},{label:D, max:130},{label:E, max:160},{label:F, max:200},{label:G, max:250},{label:H, max:0} required
- showDebug boolean default false optional

## Example
```html
<div class="enev"></div>
```

```javascript
$(function(){
  $('.enev').enev({value:94});
});
```
