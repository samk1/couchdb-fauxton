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
    this._addOptionPopoverVisible = false;
    this._editing = {};
    this._saving = {};
    this._deleting = {};
    this._newSectionName = '';
    this._newOptionName = '';
    this._newOptionValue = '';
    this._shouldUpdate = true;
  },

  editConfig: function (sections, node) {
    this._node = node;
    this._sections = sections;
    this._loading = false;
    this._shouldUpdate = true;
  },

  shouldConfigTableUpdate: function () {
    return this._shouldUpdate;
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

  isAddOptionPopoverVisible: function () {
    return this._addOptionPopoverVisible;
  },

  getNewSectionName: function () {
    return this._newSectionName;
  },

  getNewOptionName: function () {
    return this._newOptionName;
  },

  getNewOptionValue: function () {
    return this._newOptionValue;
  },

  editOption: function (sectionName, optionName) {
    set(this._editing, sectionName, optionName);
    this._shouldUpdate = true;
  },

  setOptionValue: function (sectionName, optionName, newValue) {
    set(this._sections, sectionName, optionName, newValue);
    this._shouldUpdate = true;
  },

  stopOptionEdit: function (sectionName, optionName) {
    unset(this._editing, sectionName, optionName);
    unset(this._saving, sectionName, optionName);
    this._shouldUpdate = true;
  },

  isOptionEditing: function (sectionName, optionName) {
    return get(this._editing, sectionName, optionName);
  },

  saveOption: function (sectionName, optionName) {
    set(this._saving, sectionName, optionName);
    this._shouldUpdate = true;
  },

  isOptionSaving: function (sectionName, optionName) {
    return get(this._saving, sectionName, optionName);
  },

  deleteOption: function (sectionName, optionName) {
    set(this._deleting, sectionName, optionName);
    this._shouldUpdate = true;
  },

  isOptionDeleting: function (sectionName, optionName) {
    return get(this._saving, sectionName, optionName);
  },

  deleteOptionValue: function (sectionName, optionName) {
    unset(this._sections, sectionName, optionName);
    this._shouldUpdate = true;
  },

  stopOptionDelete: function (sectionName, optionName) {
    unset(this._deleting, sectionName, optionName);
    this._shouldUpdate = true;
  },

  dispatch: function (action) {
    if (action.options) {
      var sectionName = action.options.sectionName;
      var optionName = action.options.optionName;
      var value = action.options.value;
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
        this.setOptionValue(sectionName, optionName, value);
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
        this.setOptionValue(sectionName, optionName, value);
        this._adding = false;
        this._addOptionPopoverVisible = false;
        this._newOptionName = '';
        this._newOptionValue = '';
      break;

      case ActionTypes.OPTION_ADD_FAILURE:
        this._adding = false;
      break;

      case ActionTypes.TOGGLE_ADD_OPTION_POPOVER:
        this._addOptionPopoverVisible = !this._addOptionPopoverVisible;
      break;

      case ActionTypes.HIDE_ADD_OPTION_POPOVER:
        this._addOptionPopoverVisible = false;
      break;

      case ActionTypes.UPDATE_NEW_OPTION_NAME:
        this._newOptionName = optionName;
      break;

      case ActionTypes.UPDATE_NEW_SECTION_NAME:
        this._newSectionName = sectionName;
      break;

      case ActionTypes.UPDATE_NEW_OPTION_VALUE:
        this._newOptionValue = value;
      break;

      case ActionTypes.CONFIG_TABLE_UPDATED:
        this._shouldUpdate = false;
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
