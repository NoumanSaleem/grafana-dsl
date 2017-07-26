# Grafana-DSL

A DSL for programmatically generating [Grafana](http://grafana.org/) dashboards. Currently, this module does not interface with Grafana's API. Instead, write the configurations to disk and configure Grafana to load the dashboards.

```
[dashboards.json]
enabled = true
path = /var/lib/dashboards
```

## Installation
`npm install -s grafana-dsl`

## Usage
```
import dashboard from 'grafana-dsl';

const backendDashboard = dashboard()
  .title('Backend Dashboard')
  .row(row => row()
    .graohPanel(panel => panel()
      .title('CPU')
      .span(12)
      .target(target => target()
        .expr('node_cpu')
        .datasource('Prometheus'))
      .alert(alert=> alert()
        .name('High CPU')
        .notifications([1])
        .condition(condition => condition()
          .when('max')
          .of(1)
          .isAbove(50)))));

// output
require('fs').writeFileSync(__dirname + '/backendDashboard.json', JSON.stringify(backendDashboard.serialize()));
```

In addition to the above syntax, you can also create objects like rows, panels, alerts, and more directly. This pattern enables reusable configuration components.

```
import dashboard, { graohPanel } from 'grafana-dsl';

const cpuGraph = graphPanel()
  .title('CPU')
  .span(12)
  .target(target => target()
    .expr('')
    .datasource('Prometheus'))
  .alert(alert => alert()
    .name('High CPU')
    .notifications([1])
    .condition(condition => condition()
      .when('avg')
      .of(1)
      .isAbove(50)));

const backendDashboard = dashboard()
  .row(row => row()
    .graphPanel(cpuGraph));

// output
require('fs').writeFileSync(__dirname + '/backendDashboard.json', JSON.stringify(backendDashboard.serialize()));
```

## DSL
All top level DSL methods accept a config object. Use this parameter to directly pass raw Grafana configuration to accomodate cases where the DSL doesn't provide a required method.

### Dashboard
|method|description|default|
|---|---|---|
|`title`|Set dashboard title|`''`|
|`tags`|Set dashboard tags|`[]`|
|`refresh`|Set refresh rate|`1m`|
|`time(from,to='now')`|Set time range|`from=now-1h` `to=now`
|`template`|Add template variable. Accepts either a callback function receiving `template` DSL function, or a pre-configured `template` object||
|`row`|Add row. Accepts either a callback function receiving `row` DSL function, or a pre-built `row` object||

### Template
|method|description|default|
|---|---|---|
|`name`|Set template variable name|`''`|
|`type`|Set template variable type (e.g: query,custom)|`''`|
|`multi(val=true)`|Toggle multi-select|`false`|
|`includeAll(val=true)`|Include all option|`false`|
|`query`|Template variable query. For `type=custom`, a comma delimited list of options||
|`datasource`|For `type=query`, set the datasource||
|`regex`|For `type=query`, apply a regex against each return value||
|`refreshOnLoad`|Sets `refresh=1` to enable variable refresh on dashboard load||
|`refreshOnTimeChange`|Sets `refresh=2` to enable variable refresh on time change||

### Row
|method|description|default|
|---|---|---|
|`title`|Set row title|`''`|
|`singleStatPanel`|Accepts either a callback function receiving `singleStatPanel` DSL function, or a pre-configured `singleStatPanel` object||
|`graphPanel`|Accepts either a callback function receiving `graphPanel` DSL function, or a pre-configured `graphPanel` object||

### graphPanel
|method|description|default|
|---|---|---|
|`title`|Set panel title|`''`|
|`span`|Set panel span (Out of 12 columns)|`12`|
|`datasource`|Set panel datasource|`''`|
|`lines`|Toggle lines draw mode|`true`|
|`points`|Toggle lines draw mode|`false`|
|`bars`|Toggle lines draw mode|`false`|
|`format`|Shortcut for setting yaxes.format|``|
|`fill`|Set fill transparency 0-10|`1`|
|`yaxes`|Configure yaxes for graph. Accepts either a callback function receiving `yaxes` DSL function, or a pre-configured `yaxes` object||
|`target`|Add target to panel. Accepts either a callback function receiving `target` DSL function, or a pre-configured `target` object||
|`alert`|Configure alerting for panel. Accepts either a callback function receiving an `alert` DSL function, or a pre-configured `alert` object||

### singleStatPanel
|method|description|default|
|---|---|---|
|`title`|Set panel title|`''`|
|`span`|Set panel span (Out of 12 columns)|`12`|
|`format`|Set data format (e.g short, percent)|`'short'`|
|`datasource`|Set panel datasource|`''`|
|`target`|Add target to panel. Accepts either a callback function receiving `target` DSL function, or a pre-configured `target` object||
|`sparkline`|Enable sparklines. Accepts either a callback function receiving a `sparkline` DSL function, or a pre-configured `sparkline` object||
|`alert`|Configure alerting for panel. Accepts either a callback function receiving an `alert` DSL function, or a pre-configured `alert` object||
|`valueName`|Set value name property for panel|`'avg'`|

### Target
Configure a panel target.

|method|description|default|
|---|---|---|
|`expr`|The query to execute|`''`|
|`legendFormat`|Configure target's legend format||

### sparkline
Configure `singlestat` panel sparkline.

|method|description|default|
|---|---|---|
|`show(val=true)`|Show sparkline|`false`|
|`full(val=true)`|Set sparkline to full background mode|`false`|
|`fillColor({rgba(,,,)})`|Set sparkline fill color|`'rgba(31, 118, 189, 0.18)'`|
|`lineColor({rgb(,,,)})`|Set sparkline line color|`'rgb(31, 120, 193)'`|

### yaxes
Configure panel `yaxes` for `graphPanel`
|method|description|default|
|---|---|---|
|`format`|Set data format|`'short'`|
|`show`|Show y axes|`true`|
|`max`|Set max value|``|
|`min`|Set min value|``|

### Alert
Configure a panel alert. Currently only for `graphPanel`

|method|description|default|
|---|---|---|
|`name`|Set alert name|`''`|
|`frequency`|Set alert check frequency|`''`|
|`notifications([{0-9},])`|Set alert notifications. Pass in the notification ID. You can find this from the notification edit page (e.g `/alerting/notification/1/edit` -> `.notifications([1])`)|`[]`|
|`condition`|Configure an alert condition. Accepts either a callback function receiving a `condition` DSL function, or a pre-configured `condition` object||

### Condition
Configure an alert condition.

|method|description|default|
|---|---|---|
|`when`|e.g: `avg,min,max,sum,median,count,last`|`'avg'`|
|`of(index,start='5m',end='now')`|Set the alert query target and window. The first param is the _id_ of a configured panel target. If your panel has a single target, you would pass `1`|`index=null` `start='5m'` `end='now'`|
|`isAbove(val)`|Set condition evaluator to `gt`||
|`isBelow(val)`|Set alert condition evaluator to `lt`||
|`isOutsideRange(from, to)`|Set alert condition evaluator to `outside_range`||
|`isWithintRange(from, to)`|Set alert condition evaluator to `within_range`||
|`hasNoValue`|Set alert condition evaluator to `no_value`||


### Contributors
- [Nouman Saleem](https://github.com/noumanSaleem)
