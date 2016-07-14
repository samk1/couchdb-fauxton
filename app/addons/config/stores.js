import FauxtonAPI from '../../core/api';
import ActionTypes from './actiontypes';

function assign(object, sectionName, optionName, value) {
  if (!object[sectionName]) {
    object[sectionName] = {};
  }

  object[sectionName][optionName] = value;
}

function get(object, sectionName, optionName) {
  if (object[sectionName]) {
    return object[sectionName][optionName];
  }
}

var ConfigStore = FauxtonAPI.Store.extend({
  initialize: function () {
    this.reset();
  },

  reset: function () {
    this._node = null;
    this._sections = [];
    this._loading = true;
    this._editing = {};
    this._saving = {};
  },

  editConfig: function (sections, node) {
    this._node = node;
    this._sections = sections;
    this._loading = false;
  },

  getNode: function () {
    return this._node;
  },

  getSections: function () {
    return this._sections;
  },

  isLoading: function () {
    return this._loading;
  },

  editOption: function (sectionName, optionName) {
    assign(this._editing, sectionName, optionName, true);
  },

  setOptionValue: function (sectionName, optionName, newValue) {
    assign(this._sections, sectionName, optionName, newValue);
  },

  stopOptionEdit: function (sectionName, optionName) {
    assign(this._editing, sectionName, optionName, false);
    assign(this._saving, sectionName, optionName, false);
  },

  isOptionEditing: function (sectionName, optionName) {
    return get(this._editing, sectionName, optionName);
  },

  saveOption: function (sectionName, optionName) {
    assign(this._saving, sectionName, optionName, true);
  },

  isOptionSaving: function (sectionName, optionName) {
    return get(this._saving, sectionName, optionName);
  },

  dispatch: function (action) {
    switch (action.type) {
      case ActionTypes.EDIT_CONFIG:
        this.editConfig(action.options.sections, action.options.node);
      break;

      case ActionTypes.LOADING_CONFIG:
        this._loading = true;
      break;

      case ActionTypes.EDITING_OPTION:
        this.editOption(action.options.sectionName, action.options.optionName);
      break;

      case ActionTypes.SAVING_OPTION:
        this.saveOption(action.options.sectionName, action.options.optionName);
      break;

      case ActionTypes.OPTION_SAVE_SUCCESS:
        var optionName = action.options.optionName;
        var sectionName = action.options.sectionName;
        var newValue = action.options.newValue;
        this.setOptionValue(sectionName, optionName, newValue);
        this.stopOptionEdit(sectionName, optionName);
      break;

      case ActionTypes.OPTION_EDIT_CANCEL:
        this.stopOptionEdit(action.options.sectionName, action.options.optionName);
      break;

    }

    this.triggerChange();
  }
});

var configStore = new ConfigStore();
configStore.dispatchToken = FauxtonAPI.dispatcher.register(configStore.dispatch.bind(configStore));

export default {
  configStore: configStore
};
