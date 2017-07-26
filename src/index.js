function letterAtIndex(index) {
  return String.fromCharCode(65 + index);
}

function legend(defaults = {}) {
  const settings = {
    show: true,
    values: true,
    sortDesc: true,
  };

  return {
    show(val=true) {
      settings.show = val;
      return this;
    },
    asTable(val=true) {
      settings.alignAsTable = val;
      return this;
    },
    min(val=true) {
      settings.min = val;
      return this;
    },
    max(val=true) {
      settings.max = val;
      return this;
    },
    avg(val=true) {
      settings.avg = val;
      return this;
    },
    current(val=true) {
      settings.current = val;
      return this;
    },
    total(val=true) {
      settings.total = val;
      return this;
    },
    hideZero(val=true) {
      settings.hideZero = val;
      return this;
    },
    sort(val) {
      settings.sort = val;
      return this;
    },
    serialize() {
      return Object.assign({}, settings, defaults);
    },
  };
}

function condition(defaults = {}) {
  const settings = {
    type: 'query',
    reducer: {
      type: 'avg',
      params: [],
    },
  };

  return {
    when(val) {
      settings.reducer = {
        type: val,
        params: [],
      };

      return this;
    },
    of(index, start = '5m', end = 'now') {
      const t = typeof index === 'string' ? index : letterAtIndex(index);

      settings.query = {
        params: [t, start, end],
      };

      return this;
    },
    isAbove(val) {
      settings.evaluator = {
        type: 'gt',
        params: [val],
      };

      return this;
    },
    isBelow(val) {
      settings.evaluator = {
        type: 'lt',
        params: [val],
      };

      return this;
    },
    isOutsideRange(from, to) {
      settings.evaluator = {
        params: [from, to],
        type: 'outside_range',
      };

      return this;
    },
    isWithinRange(from, to) {
      settings.evaluator = {
        params: [from, to],
        type: 'within_range',
      };

      return this;
    },
    hasNoValue() {
      settings.evaluator = {
        params: [],
        type: 'no_value',
      };

      return this;
    },
    serialize() {
      if (!settings.query) this.of(0);

      return Object.assign({}, settings, defaults);
    },
  };
}

function alert(defaults = {}) {
  const settings = {
    name: '',
    conditions: [],
    notifications: [],
    frequency: '60s',
    executionErrorState: 'alerting',
    noDataState: 'no_data',
    handler: 1,
  };

  return {
    name(val) {
      settings.name = val;
      return this;
    },
    condition(val) {
      settings.conditions.push(typeof val === 'function' ? val(condition) : val);
      return this;
    },
    frequency(val) {
      settings.frequency = val;
      return this;
    },
    notifications(ids) {
      settings.notifications = settings.notifications.concat(ids);
      return this;
    },
    serialize() {
      return Object.assign({}, settings, {
        notifications: settings.notifications.map(id => ({ id })),
        conditions: settings.conditions.map(c => c.serialize()),
      }, defaults);
    },
  };
}

function template(defaults = {}) {
  const settings = {
    refresh: 0,
  };

  return {
    type(val) {
      settings.type = val;
      return this;
    },
    name(val) {
      settings.name = val;
      return this;
    },
    multi(val = true) {
      settings.multi = val;
      return this;
    },
    includeAll(val = true) {
      settings.includeAll = val;
      return this;
    },
    datasource(val) {
      settings.datasource = val;
      return this;
    },
    query(val) {
      settings.query = val;
      return this;
    },
    regex(val) {
      settings.regex = val;
      return this;
    },
    refresh(val) {
      settings.refresh = val;
      return this;
    },
    refreshOnLoad() {
      settings.refresh = 1;
      return this;
    },
    refreshOnTimeChange() {
      settings.refresh = 2;
      return this;
    },
    serialize() {
      return Object.assign({}, settings, defaults);
    },
  };
}

function sparkline(defaults = {}) {
  const settings = {
    fillColor: 'rgba(31, 118, 189, 0.18)',
    full: false,
    lineColor: 'rgb(31, 120, 193)',
    show: false,
  };

  return {
    fillColor(val) {
      settings.fillColor = val;
      return this;
    },
    full(val = true) {
      settings.full = val;
      return this;
    },
    lineColor(val) {
      settings.lineColor = val;
      return this;
    },
    show(val = true) {
      settings.show = val;
      return this;
    },
    serialize() {
      return Object.assign({}, settings, defaults);
    },
  };
}

function target(defaults = {}) {
  const settings = {
    step: 10,
    intervalFactor: 2,
    expr: '',
    legendFormat: '',
  };

  return {
    expr(val) {
      settings.expr = val;
      return this;
    },
    legendFormat(val) {
      settings.legendFormat = val;
      return this;
    },
    serialize(index) {
      return Object.assign({}, settings, {
        refId: letterAtIndex(index),
      }, defaults);
    },
  };
}

function yaxes(defaults = {}) {
  const settings = {
    format: 'short',
    show: true,
  };

  return {
    format(val) {
      settings.format = val;
      return this;
    },
    show(val=true) {
      settings.show = val;
      return this;
    },
    max(val) {
      settings.max = val;
      return this;
    },
    min(val) {
      settings.min = val;
      return this;
    },
    serialize() {
      return Object.assign({}, settings, defaults);
    },
  };
}

function graphPanel(defaults = {}) {
  const settings = {
    title: '',
    type: 'graph',
    datasource: '',
    editable: true,
    lines: true,
    span: 12,
    targets: [],
    yaxes: [],
    fill: 1,
  };

  return {
    title(val) {
      settings.title = val;
      return this;
    },
    alert(val) {
      settings.alert = typeof val === 'function' ? val(alert) : val;
      return this;
    },
    bars(val = true) {
      settings.bars = val;
      return this;
    },
    lines(val = true) {
      settings.lines = val;
      return this;
    },
    points(val = true) {
      settings.points = val;
      return this;
    },
    datasource(val) {
      settings.datasource = val;
      return this;
    },
    span(val) {
      settings.span = val;
      return this;
    },
    target(val) {
      settings.targets.push(typeof val === 'function' ? val(target) : val);
      return this;
    },
    legend(val) {
      settings.legend = typeof val === 'function' ? val(legend) : val;
      return this;
    },
    yaxes(val) {
      settings.yaxes.push(typeof val === 'function' ? val(yaxes) : val);
      return this;
    },
    format(val) {
      return this.yaxes(y => y().format(val));
    },
    fill(val=1) {
      settings.fill = val;
      return this;
    },
    serialize(id) {
      const serialized = {
        id,
        targets: settings.targets.map((t, i) => t.serialize(i)),
        yaxes: settings.yaxes.concat([yaxes(), yaxes()]).slice(0, 2).map(y => y.serialize()),
      };

      if (settings.alert) serialized.alert = settings.alert.serialize();
      if (settings.legend) serialized.legend = settings.legend.serialize();

      return Object.assign({}, settings, serialized, defaults);
    },
  };
}

function singleStatPanel(defaults = {}) {
  const settings = {
    title: '',
    type: 'singlestat',
    datasource: '',
    editable: true,
    format: 'short',
    span: 12,
    targets: [],
    valueName: 'avg',
  };

  return {
    title(val) {
      settings.title = val;
      return this;
    },
    datasource(val) {
      settings.datasource = val;
      return this;
    },
    format(val) {
      settings.format = val;
      return this;
    },
    span(val) {
      settings.span = val;
      return this;
    },
    sparkline(val) {
      settings.sparkline = typeof val === 'function' ? val(sparkline) : val;
      return this;
    },
    target(val) {
      settings.targets.push(typeof val === 'function' ? val(target) : val);
      return this;
    },
    valueName(val = 'avg') {
      settings.valueName = val;
      return this;
    },
    serialize(id) {
      const serialized = {
        id,
        targets: settings.targets.map((t, i) => t.serialize(i)),
      };

      if (settings.sparkline) serialized.sparkline = settings.sparkline.serialize();

      return Object.assign({}, settings, serialized, defaults);
    },
  };
}

function row(defaults = {}) {
  const settings = {
    panels: [],
  };

  return {
    title(val) {
      settings.title = val;
      return this;
    },
    graphPanel(val) {
      settings.panels.push(typeof val === 'function' ? val(graphPanel) : val);
      return this;
    },
    singleStatPanel(val) {
      settings.panels.push(typeof val === 'function' ? val(singleStatPanel) : val);
      return this;
    },
    serialize(panelIndex) {
      let i = panelIndex;
      return Object.assign({}, settings, {
        panels: settings.panels.length ? settings.panels.map(p => p.serialize(i += 1)) : [],
      }, defaults);
    },
  };
}

function dashboard(defaults = {}) {
  const settings = {
    title: '',
    tags: [],
    time: {
      from: 'now-1h',
      to: 'now',
    },
    refresh: '1m',
    rows: [],
    templating: [],
  };

  return {
    title(val) {
      settings.title = val;
      return this;
    },
    tags(tags) {
      settings.tags = settings.tags.concat(tags);
      return this;
    },
    refresh(val) {
      settings.refresh = val;
      return this;
    },
    row(val) {
      settings.rows.push(typeof val === 'function' ? val(row) : val);
      return this;
    },
    time(from, to = 'now') {
      settings.time.from = from;
      settings.time.to = to;
      return this;
    },
    template(val) {
      settings.templating.push(typeof val === 'function' ? val(template) : val);
      return this;
    },
    serialize() {
      let panelCount = 0;
      const rows = settings.rows.map((r) => {
        const serialized = r.serialize(panelCount);
        panelCount = panelCount += serialized.panels.length;
        return serialized;
      });

      return Object.assign({}, settings, {
        rows,
        templating: { list: settings.templating.map(t => t.serialize()) },
      }, defaults);
    },
  };
}

export default dashboard;
export { row, graphPanel, singleStatPanel, target, sparkline, alert, condition };

