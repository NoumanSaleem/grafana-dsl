import { describe, it } from 'mocha';
import sinon from 'sinon';
import assert from 'assert';

import dashboard, { graphPanel } from '../src';

describe('dashboard()', function () {
  it('should serialize rows', function () {
    const serialized = { panels: [] };
    const serialize = sinon.stub().returns(serialized);
    const row = { serialize };

    dashboard().row(row).serialize();

    assert(serialize.callCount === 1); 
  });

  it('should pass panel count to row serialize()', function () {
    const r1Serialized = { panels: [null,null] };
    const r2Serialized = { panels: [null] };
    const r3Serialized = { panels: [] };
    const r1Stub = sinon.stub().returns(r1Serialized);
    const r2Stub = sinon.stub().returns(r2Serialized);
    const r3Stub = sinon.stub().returns(r3Serialized);

    dashboard()
      .row({ serialize: r1Stub })
      .row({ serialize: r2Stub })
      .row({ serialize: r3Stub })
      .serialize();

    assert(r1Stub.args[0][0] === 0);
    assert(r2Stub.args[0][0] === 2);
    assert(r3Stub.args[0][0] === 3);
  });
});

describe('graphPanel()', function () {
  context('format()', function () {
    it('it should proxy yaxes', function () {
      const format = 'percent';
      const formatStub = sinon.stub();
      const yaxesStub = sinon.stub().returns({ format: formatStub });
      const yaxes = (fn) => fn(yaxesStub);
      const panel = graphPanel();

      panel.yaxes = sinon.stub().yields(yaxesStub);
      panel.format(format);

      assert(formatStub.callCount === 1);
      assert(formatStub.args[0][0] === format);
    });
  });
});

