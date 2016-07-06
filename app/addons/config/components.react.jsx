/**
 * Created by sam on 7/07/2016.
 */

import React from "react";
import Stores from "./stores";

var configStore = Stores.configStore;

var ConfigController = React.createClass({
  getStoreState: function () {
    return {
      sections: configStore.getSections(),
      loading: configStore.isLoading()
    }
  },
  
  getInitialState: function () {
    return this.getStoreState();
  },
  
  componentDidMount: function () {
    configStore.on('change', this.onChange, this);
  },
  
  componentDidUnmount: function () {
    configStore.off('change', this.onChange, this);
  },
  
  onChange: function () {
    if (this.isMounted()) {
      this.setState(this.getStoreState());
    }
  },
  
  render: function () {
    var sections = this.state.sections;
    var loading = this.state.loading;
    
    return (
      <ConfigTable
        sections={sections}
        loading={loading} />
    )
  }

});

var ConfigTable = React.createClass({
  createSections: function () {
    return _.map(this.props.sections, function(section) {
      return (
        <ConfigSection 
          options={section.options}
          name={section.name} />
      );
    });  
  },
  
  render: function () {
    var sections = this.createSections();
    return (
      <table className="config table table-striped table-bordered">
        <thead>
          <th id="config-section">Section</th>
          <th id="config-option">Option</th>
          <th id="">Value</th>
          <th id="config-trash"></th>
        </thead>
        <tbody>
          {sections}
        </tbody>
      </table>
    )
  }
});
        
var ConfigSection = React.createClass({
  createSectionHeader: function (name, option) {
    return (
      <ConfigSectionHeader name={name} option={option} />
    );
  },
  
  createOptions: function (options) {
    return (
      <ConfigOptions options={options} />
    );
  },
  
  render: function () {
    var name = this.props.name;
    return _.map(this.props.values, function (options, index) {
      if (index == 0) {
        return this.createSectionHeader(name, options);
      } else {
        return this.createOptions(options);
      }
    }.bind(this))
  }
});

var ConfigSectionHeader = React.createClass({
  render: function () {
    var value = this.props.options.value;
    var valueName = this.props.options.name;
    var sectionName = this.props.name;
    
    return (
      <tr>
        <th>{sectionName}</th>
        <td>{valueName}</td>
        <td>{value}</td>
      </tr>
    );
  }
});

var ConfigOptions = React.createClass({
  render: function () {
    var value = this.props.options.value;
    var name = this.props.options.name;
    
    return (
      <tr>
        <th></th>
        <td>{name}</td>
        <td>{value}</td>
      </tr>
    );
  }
});