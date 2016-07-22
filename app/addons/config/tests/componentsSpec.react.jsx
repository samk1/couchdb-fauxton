// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.
import FauxtonAPI from "../../../core/api";
import Views from "../components.react";
import Actions from "../actions";
import Resources from "../resources";
import Stores from "../stores";
import utils from "../../../../test/mocha/testUtils";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import sinon from "sinon";

FauxtonAPI.router = new FauxtonAPI.Router([]);
var assert = utils.assert;
var configStore = Stores.configStore;

describe('Config Components', function () {
  describe('ConfigTableController', function () {
    var container, elm;

    beforeEach(function () {
      container = document.createElement('div');
      configStore._loading = false;
      configStore._sections = {};
      elm = TestUtils.renderIntoDocument(
        <Views.ConfigTableController node='node2@127.0.0.1' />,
        container
      );
    });

    it('deletes options', function () {
      var spy = sinon.stub(Actions, 'deleteOption');

      elm.deleteOption();
      assert.ok(spy.calledOnce);
    });

    it('saves options', function () {
      var spy = sinon.stub(Actions, 'saveOption');

      elm.saveOption();
      assert.ok(spy.calledOnce);
    });
  });

  describe('AddOptionController', function () {
    var container, elm;

    beforeEach(function () {
      container = document.createElement('div');
      elm = TestUtils.renderIntoDocument(
        <Views.AddOptionController node='node2@127.0.0.1'/>,
        container
      );
    });

    it('adds options', function () {
      var spy = sinon.stub(Actions, 'addOption');

      elm.addOption();
      assert.ok(spy.calledOnce);
    });
  });
});
