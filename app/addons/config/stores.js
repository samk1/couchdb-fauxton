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

var ConfigStore = FauxtonAPI.Store.extend({
  initialize: function () {
    this.reset();
  },

  reset: function () {
    this._sections = [];
    this._loading = true;
  },

  editConfig: function (sections) {
    this._sections = sections;
    this._loading = false;
  },

  getSections: function () {
    return this._sections;
  },

  isLoading: function () {
    return this._loading;
  },

  saveOption: function (sectionName, optionName, value) {
    set(this._sections, sectionName, optionName, value);
  },

  deleteOption: function (sectionName, optionName) {
    unset(this._sections, sectionName, optionName);
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

      case ActionTypes.OPTION_SAVE_SUCCESS:
      case ActionTypes.OPTION_ADD_SUCCESS:
        this.saveOption(sectionName, optionName, value);
      break;

      case ActionTypes.OPTION_DELETE_SUCCESS:
        this.deleteOption(sectionName, optionName);
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
