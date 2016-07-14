/**
 * Created by sam on 7/07/2016.
 */

import React from "react";
import Stores from "./stores";
import Actions from "./actions";

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
            <th id="config-section">Section</th>
            <th id="config-option">Option</th>
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

    Actions.saveOption(configStore.getNode(), sectionName, optionName, value);
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
        <td className="text-center"><i className="icon icon-trash"></i></td>
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
          <input className="js-value-input" defaultValue={value} disabled={isSaving} onChange={this.onChange} />
          <button className="btn btn-success fonticon-ok-circled btn-small"
                  onClick={() => onSave(this.state.value)} />
          <button className="btn btn-success fonticon-cancel-circled"
                  onClick={onCancel} />
        </td>
      );
    } else {
      return (
        <td onClick={onEdit}>{value}</td>
      );
    }
  }
});

export default {
  ConfigController: ConfigController
};
