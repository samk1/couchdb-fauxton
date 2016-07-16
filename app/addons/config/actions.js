/**
 * Created by sam on 14/07/2016.
 */
import ActionTypes from './actiontypes';
import FauxtonAPI from '../../core/api';
import Resources from './resources';

export default {
  fetchAndEditConfig: function (node) {
    var config = new Resources.ConfigModel({node: node});

    FauxtonAPI.dispatch({ type: ActionTypes.LOADING_CONFIG });

    FauxtonAPI.when([config.fetch()]).then(function () {
      this.editSections(config.get('sections'), node);
    }.bind(this));
  },

  editSections: function (sections, node) {
    FauxtonAPI.dispatch({
      type: ActionTypes.EDIT_CONFIG,
      options: { sections, node }
    });
  },

  saveOption: function (node, sectionName, optionName, value) {
    FauxtonAPI.dispatch({
      type: ActionTypes.SAVING_OPTION,
      options: { sectionName, optionName }
    });

    var optionModel = new Resources.OptionModel({ node, sectionName, optionName, value });

    optionModel.save().then(
      function success () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_SAVE_SUCCESS,
          options: { sectionName, optionName, value }
        });
      },
      function failure () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_SAVE_FAILURE,
          options: { optionName, sectionName }
        });
      }
    );
  },

  editOption: function (sectionName, optionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.EDITING_OPTION,
      options: { optionName, sectionName }
    });
  },

  cancelOptionEdit: function (sectionName, optionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.OPTION_EDIT_CANCEL,
      options: { optionName, sectionName }
    });
  },

  addOption: function (node, sectionName, optionName, value) {
    FauxtonAPI.dispatch({ type: ActionTypes.ADDING_OPTION });

    var optionModel = new Resources.OptionModel({ node, sectionName, optionName, value });

    optionModel.save().then(
      function success () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_ADD_SUCCESS,
          options: { sectionName, optionName, value }
        });
      },
      function failure () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_ADD_FAILURE,
          options: { optionName, sectionName }
        });
      }
    );
  },

  deleteOption: function (node, sectionName, optionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.DELETING_OPTION,
      options: { optionName, sectionName }
    });

    var optionModel = new Resources.OptionModel({
      node, sectionName, optionName
    });

    optionModel.destroy().then(
      function success () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_DELETE_SUCCESS,
          options: { optionName, sectionName }
        });
      },
      function failure () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_DELETE_FAILURE,
          options: { optionName, sectionName }
        });
      }
    );
  },

  toggleAddOptionPopoverVisible: function () {
    FauxtonAPI.dispatch({ type: ActionTypes.TOGGLE_ADD_OPTION_POPOVER });
  },

  hideAddOptionPopover: function () {
    FauxtonAPI.dispatch({ type: ActionTypes.HIDE_ADD_OPTION_POPOVER });
  },

  updateNewSectionName: function (sectionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.UPDATE_NEW_SECTION_NAME,
      options: { sectionName }
    });
  },

  updateNewOptionName: function (optionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.UPDATE_NEW_OPTION_NAME,
      options: { optionName }
    });
  },

  updateNewOptionValue: function (value) {
    FauxtonAPI.dispatch({
      type: ActionTypes.UPDATE_NEW_OPTION_VALUE,
      options: { value }
    });
  }
};
