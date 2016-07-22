//  Licensed under the Apache License, Version 2.0 (the "License"); you may not
//  use this file except in compliance with the License. You may obtain a copy of
//  the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
//  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
//  License for the specific language governing permissions and limitations under
//  the License.
//

import React from "react";
import ReactDOM from "react-dom";
import Stores from "./stores";
import Actions from "./actions";
import { Overlay, Button, Popover } from "react-bootstrap";
import Components from "../components/react-components.react";
import FauxtonComponents from "../fauxton/components.react";

var configStore = Stores.configStore;

var ConfigController = React.createClass({
  getStoreState: function () {
    return {
      sections: configStore.getSections(),
      loading: configStore.isLoading(),
      node: configStore.getNode()
    };
  },

  getInitialState: function () {
    return this.getStoreState();
  },

  componentDidMount: function () {
    configStore.on('change', this.onChange, this);
  },

  componentWillUnmount: function () {
    configStore.off('change', this.onChange, this);
  },

  onChange: function () {
    if (this.isMounted()) {
      this.setState(this.getStoreState());
    }
  },

  saveOption: function (option) {
    Actions.saveOption(this.state.node, option);
  },

  deleteOption: function (option) {
    Actions.deleteOption(this.state.node, option);
  },

  render: function () {
    if (this.state.loading) {
      return (
        <div className="view">
          <Components.LoadLines />
        </div>
      );
    } else {
      return (
        <ConfigTable
          onDeleteOption={this.deleteOption}
          onSaveOption={this.saveOption}
          sections={this.state.sections} />
      );
    }
  }

});

var ConfigTable = React.createClass({
  getInitialState: function () {
    return {
      editingSectionName: null,
      editingOptionName: null
    };
  },

  onSave: function (option) {
    this.setState(this.getInitialState());
    this.props.onSaveOption(option);
  },

  onEdit: function (option) {
    this.setState({
      editingSectionName: option.sectionName,
      editingOptionName: option.optionName
    });
  },

  onCancelEdit: function () {
    this.setState(this.getInitialState());
  },

  createOptions: function () {
    var options = _.sortBy(_.flatten(_.map(this.props.sections, function(section, sectionName) {
      return _.map(section, function (value, optionName) {
        return { sectionName, optionName, value};
      });
    })), o => o.sectionName, o => o.optionName);

    var p = null; // previous section name
    return _.map(options, function (option) {
      var key = `${option.sectionName}:${option.optionName}`;
      var editing = this.state.editingSectionName == option.sectionName
        && this.state.editingOptionName == option.optionName;

      return <ConfigOption
        // true when new section name is first encountered
        header={p != option.sectionName ? (p = option.sectionName, true) : false}
        editing={editing}
        option={option}
        onDelete={this.props.onDeleteOption}
        onSave={this.onSave}
        onEdit={() => this.onEdit(option)}
        onCancelEdit={this.onCancelEdit}
        key={key}
      />;
    }.bind(this));
  },

  render: function () {
    var options = this.createOptions();

    return (
      <table className="config table table-striped table-bordered">
        <thead>
          <tr>
            <th id="config-section" width="22%">Section</th>
            <th id="config-option" width="22%">Option</th>
            <th id="config-value">Value</th>
            <th id="config-trash"></th>
          </tr>
        </thead>
        <tbody>
        {options}
        </tbody>
      </table>
    );
  }
});

var ConfigOption = React.createClass({
  getInitialState: function () {
    return { deleting: false };
  },

  onSave: function (value) {
    var option = this.props.option;
    option.value = value;
    this.props.onSave(option);
  },

  onDelete: function () {
    this.setState({ deleting: true });
    this.props.onDelete(this.props.option);
  },

  render: function () {
    var trClass = this.state.deleting ? "config-item config-item-deleting" : "config-item";

    return (
      <tr className={trClass}>
        <th>{this.props.header && this.props.option.sectionName}</th>
        <ConfigOptionName name={this.props.option.optionName} />
        <ConfigOptionValue
          value={this.props.option.value}
          editing={this.props.editing}
          onSave={this.onSave}
          onEdit={this.props.onEdit}
          onCancelEdit={this.props.onCancelEdit}
        />
        <ConfigOptionTrash
          onDelete={this.onDelete} />
      </tr>
    );
  }
});

var ConfigOptionName = React.createClass({
  render: function () {
    var name = this.props.name;

    return (
      <td>{name}</td>
    );
  }
});

var ConfigOptionValue = React.createClass({
  getInitialState: function () {
    // the prop specifies the initial value, which the user can edit
    return { value: this.props.value };
  },

  onChange: function (event) {
    this.setState({ value: event.target.value });
  },

  onSave: function () {
    if (this.state.value !== this.props.value) {
      this.props.onSave(this.state.value);
    }
  },

  onEdit: function () {
    this.props.onEdit();
  },

  onCancelEdit: function () {
    this.setState(this.getInitialState());
    this.props.onCancelEdit();
  },

  render: function () {
    if (this.props.editing) {
      return (
        <td>
          <div className="config-value-form">
            <input
              onChange={this.onChange}
              defaultValue={this.props.value}
              autoFocus type="text" className="config-value-input" />
            <button className="btn btn-success fonticon-ok-circled btn-small"
                    onClick={this.onSave} />
            <button className="btn fonticon-cancel-circled btn-small"
                    onClick={this.onCancelEdit} />
          </div>
        </td>
      );
    } else {
      return (
        <td className="config-show-value" onClick={this.onEdit}>
          {this.state.value}
        </td>
      );
    }
  }
});

var ConfigOptionTrash = React.createClass({
  getInitialState: function () {
    return {
      showModal: false
    };
  },

  render: function () {
    return (
      <td className="text-center config-item-trash config-delete-value" onClick={() => this.setState({showModal: true})}>
        <i className="icon icon-trash"></i>
        <FauxtonComponents.ConfirmationModal
          text="Are you sure you want to delete this configuration value?"
          onClose={() => this.setState({showModal: false})}
          onSubmit={this.props.onDelete}
          visible={this.state.showModal} />
      </td>
    );
  }
});

var AddOptionController = React.createClass({
  getInitialState: function () {
    return {
      sectionName: '',
      optionName: '',
      value: '',
      show: false
    };
  },

  addOption: function () {
    var option = {
      sectionName: this.state.sectionName,
      optionName: this.state.optionName,
      value: this.state.value
    };

    this.setState({ show: false });
    Actions.addOption(configStore.getNode(), option);
  },

  getPopover: function () {
    return (
      <Popover className="tray" id="add-option-popover" title="Add Option">
        <input
          onChange={e => this.setState({ sectionName: (e.target.value) })}
          type="text" name="section" placeholder="Section" autocomplete="off" autoFocus />
        <input
          onChange={e => this.setState({ optionName: (e.target.value) })}
          type="text" name="name" placeholder="Name" />
        <input
          onChange={e => this.setState({ value: (e.target.value) })}
          type="text" name="value" placeholder="Value" />
        <a
          onClick={this.addOption}
          className="btn">Create</a>
      </Popover>
    );
  },

  render: function () {
    return (
      <div id="add-option-panel">
        <Button
          id="add-option-button"
          onClick={() => this.setState({ show: !this.state.show })}
          ref="target">
          <i className="icon icon-plus header-icon"></i>
          Add Option
        </Button>

        <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="bottom"
          rootClose={true}
          target={() => ReactDOM.findDOMNode(this.refs.target)}>
          {this.getPopover()}
        </Overlay>
      </div>
    );
  }
});

export default {
  ConfigController: ConfigController,
  AddOptionController: AddOptionController
};
