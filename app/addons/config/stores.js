import FauxtonAPI from '../../core/api';
import ActionTypes from './actiontypes';

function set(object, sectionName, optionName, value) {
  if (!object[sectionName]) {
    object[sectionName] = {};
  }

  object[sectionName][optionName] = value || true;
}

function unset(object, sectionName, optionName) {
  if (object[sectionName]) {
    delete object[sectionName][optionName];
  }
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
    this._adding = false;
    this._editing = {};
    this._saving = {};
    this._deleting = {};
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

  isAdding: function () {
    return this._adding;
  },

  editOption: function (sectionName, optionName) {
    set(this._editing, sectionName, optionName);
  },

  setOptionValue: function (sectionName, optionName, newValue) {
    set(this._sections, sectionName, optionName, newValue);
  },

  stopOptionEdit: function (sectionName, optionName) {
    unset(this._editing, sectionName, optionName);
    unset(this._saving, sectionName, optionName);
  },

  isOptionEditing: function (sectionName, optionName) {
    return get(this._editing, sectionName, optionName);
  },

  saveOption: function (sectionName, optionName) {
    set(this._saving, sectionName, optionName);
  },

  isOptionSaving: function (sectionName, optionName) {
    return get(this._saving, sectionName, optionName);
  },

  deleteOption: function (sectionName, optionName) {
    set(this._deleting, sectionName, optionName);
  },

  isOptionDeleting: function (sectionName, optionName) {
    return get(this._saving, sectionName, optionName);
  },

  deleteOptionValue: function (sectionName, optionName) {
    unset(this._sections, sectionName, optionName);
  },

  stopOptionDelete: function (sectionName, optionName) {
    unset(this._deleting, sectionName, optionName);
  },

  dispatch: function (action) {
    if (action.options) {
      var sectionName = action.options.sectionName;
      var optionName = action.options.optionName;
    }

    switch (action.type) {
      case ActionTypes.EDIT_CONFIG:
        this.editConfig(action.options.sections, action.options.node);
      break;

      case ActionTypes.LOADING_CONFIG:
        this._loading = true;
      break;

      case ActionTypes.EDITING_OPTION:
        this.editOption(sectionName, optionName);
      break;

      case ActionTypes.SAVING_OPTION:
        this.saveOption(sectionName, optionName);
      break;

      case ActionTypes.OPTION_SAVE_SUCCESS:
        var newValue = action.options.newValue;
        this.setOptionValue(sectionName, optionName, newValue);
        this.stopOptionEdit(sectionName, optionName);
      break;

      case ActionTypes.OPTION_EDIT_CANCEL:
        this.stopOptionEdit(sectionName, optionName);
      break;

      case ActionTypes.DELETING_OPTION:
        this.deleteOption(sectionName, optionName);
      break;

      case ActionTypes.OPTION_DELETE_SUCCESS:
        this.deleteOptionValue(sectionName, optionName);
      break;

      case ActionTypes.OPTION_DELETE_FAILURE:
        this.stopOptionDelete(sectionName, optionName);
      break;

      case ActionTypes.ADDING_OPTION:
        this._adding = true;
      break;

      case ActionTypes.OPTION_ADD_SUCCESS:
        var value = action.options.value;
        this.setOptionValue(sectionName, optionName, value);
        this._adding = false;
      break;

      case ActionTypes.OPTION_ADD_FAILURE:
        this._adding = false;
    }

    this.triggerChange();
  }
});

var configStore = new ConfigStore();
configStore.dispatchToken = FauxtonAPI.dispatcher.register(configStore.dispatch.bind(configStore));

export default {
  configStore: configStore
};
