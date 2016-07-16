/**
 * Created by sam on 7/07/2016.
 */

import React from "react";
import ReactDOM from "react-dom";
import Stores from "./stores";
import Actions from "./actions";
import { Overlay, Button, Popover } from "react-bootstrap";

var configStore = Stores.configStore;

var ConfigController = React.createClass({
  getStoreState: function () {
    return {
      sections: configStore.getSections(),
      loading: configStore.isLoading()
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

  render: function () {
    if (configStore.isLoading()) {
      return false;
    }

    var sections = this.state.sections;
    var loading = this.state.loading;

    return (
      <ConfigTable
        sections={sections}
        loading={loading} />
    );
  }

});

var ConfigTable = React.createClass({
  createSections: function () {
    return _.map(this.props.sections, function(section, sectionName) {
      var first = true;

      return _.map(section, function (value, optionName) {
          return <ConfigOption
            header={first && !(first = false)}
            sectionName={sectionName}
            optionName={optionName}
            value={value}
            key={sectionName + ':' + optionName} />;
      });
    });
  },

  render: function () {
    var sections = this.createSections();

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
          {sections}
        </tbody>
      </table>
    );
  }
});

var ConfigOption = React.createClass({
  onSave: function (value) {
    var sectionName = this.props.sectionName;
    var optionName = this.props.optionName;

    if (this.props.value !== value) {
      Actions.saveOption(configStore.getNode(), sectionName, optionName, value);
    }
  },

  onCancel: function () {
    var sectionName = this.props.sectionName;
    var optionName = this.props.optionName;

    Actions.cancelOptionEdit(sectionName, optionName);
  },

  onEdit: function () {
    var sectionName = this.props.sectionName;
    var optionName = this.props.optionName;

    Actions.editOption(sectionName, optionName);
  },

  onDelete: function () {
    var sectionName = this.props.sectionName;
    var optionName = this.props.optionName;

    Actions.deleteOption(configStore.getNode(), sectionName, optionName);
  },

  render: function () {
    var isHeader = this.props.header;
    var sectionName = this.props.sectionName;
    var optionName = this.props.optionName;
    var value = this.props.value;

    return (
      <tr className="config-item">
        <th>{isHeader && sectionName}</th>
        <ConfigOptionName name={optionName} />
        <ConfigOptionValue
          value={value}
          onSave={this.onSave}
          onCancel={this.onCancel}
          onEdit={this.onEdit}
          editing={configStore.isOptionEditing(sectionName, optionName)}
          saving={configStore.isOptionSaving(sectionName, optionName)}/>
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
    return { value: this.props.value };
  },

  onChange: function (event) {
    this.setState({ value: event.target.value });
  },

  render: function () {
    var value = this.props.value;
    var isEditing = this.props.editing;
    var isSaving = this.props.saving;
    var onSave = this.props.onSave;
    var onCancel = this.props.onCancel;
    var onEdit = this.props.onEdit;

    if (isEditing) {
      return (
        <td>
          <div className="js-edit-value-form">
            <input autoFocus type="text" className="js-value-input" defaultValue={value} disabled={isSaving} onChange={this.onChange} />
            <button className="btn btn-success fonticon-ok-circled btn-small"
                    onClick={() => onSave(this.state.value)} />
            <button className="btn fonticon-cancel-circled btn-small"
                    onClick={onCancel} />
          </div>
        </td>
      );
    } else {
      return (
        <td onClick={onEdit}>{value}</td>
      );
    }
  }
});

var ConfigOptionTrash = React.createClass({
  render: function () {
    return (
      <td className="text-center" onClick={this.props.onDelete}>
        <i className="icon icon-trash"></i>
      </td>
    );
  }
});

var AddOptionButton = React.createClass({
  getStoreState: function () {
    return  {
      sectionName: configStore.getNewSectionName(),
      optionName: configStore.getNewOptionName(),
      value: configStore.getNewOptionValue(),
      adding: configStore.isAdding(),
      show: configStore.isAddOptionPopoverVisible()
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

  addOption: function () {
    Actions.addOption(
      configStore.getNode(),
      this.state.sectionName,
      this.state.optionName,
      this.state.value);
  },

  getPopover: function () {
    return (
      <Popover className="tray" id="add-option-popover" title="Add Option">
        <input
          onChange={e => Actions.updateNewSectionName(e.target.value)}
          disabled={this.state.adding}
          type="text" name="section" placeholder="Section" autocomplete="off" autoFocus />
        <input
          onChange={e => Actions.updateNewOptionName(e.target.value)}
          disabled={this.state.adding}
          type="text" name="name" placeholder="Name" />
        <input
          onChange={e => e => Actions.updateNewOptionValue(e.target.value)}
          disabled={this.state.adding}
          type="text" name="value" placeholder="Value" />
        <a
          onClick={this.addOption}
          disabled={this.state.adding}
          className="btn">Create</a>
      </Popover>
    );
  },

  render: function () {
    return (
      <div id="add-option-panel">
        <Button
          id="add-option-button"
          onClick={() => Actions.toggleAddOptionPopoverVisible()}
          ref="target">
            <i className="icon icon-plus header-icon"></i>
            Add Option
        </Button>

        <Overlay
          show={this.state.show}
          onHide={() => !this.state.adding && Actions.hideAddOptionPopover()}
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
  AddOptionButton: AddOptionButton
};
