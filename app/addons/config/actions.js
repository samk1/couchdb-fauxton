/**
 * Created by sam on 14/07/2016.
 */
import ActionTypes from './actiontypes';
import FauxtonAPI from '../../core/api';
import Resources from './resources';

export default {
  fetchAndEditConfig: function (node) {
    var config = new Resources.ConfigModel({node: node});

    FauxtonAPI.dispatch({
      type: ActionTypes.LOADING_CONFIG
    });

    FauxtonAPI.when([config.fetch()]).then(function () {
      this.editSections(config.get('sections'), node);
    }.bind(this));
  },

  editSections: function (sections, node) {
    FauxtonAPI.dispatch({
      type: ActionTypes.EDIT_CONFIG,
      options: { sections: sections, node: node }
    });
  },

  saveOption: function (node, sectionName, optionName, value, oldValue) {
    if (oldValue === value) {
      this.cancelOptionEdit(sectionName, optionName);
      return;
    }

    FauxtonAPI.dispatch({
      type: ActionTypes.SAVING_OPTION,
      options: { sectionName: sectionName, optionName: optionName }
    });

    var optionModel = new Resources.OptionModel({
      node: node,
      sectionName: sectionName,
      optionName: optionName,
      value: value
    });

    optionModel.save().then(
      function success () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_SAVE_SUCCESS,
          options: {
            sectionName: sectionName,
            optionName: optionName,
            newValue: value
          }
        });
      },
      function failure () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_SAVE_FAILURE,
          options: { optionName: optionName, sectionName: sectionName }
        });
      }
    );
  },

  editOption: function (sectionName, optionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.EDITING_OPTION,
      options: { optionName: optionName, sectionName: sectionName }
    });
  },

  cancelOptionEdit: function (sectionName, optionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.OPTION_EDIT_CANCEL,
      options: { optionName: optionName, sectionName: sectionName }
    });
  },

  addOption: function (node, sectionName, optionName, value) {
    FauxtonAPI.dispatch({
      type: ActionTypes.ADDING_OPTION
    });

    var optionModel = new Resources.OptionModel({
      node: node,
      sectionName: sectionName,
      optionName: optionName,
      value: value
    });

    optionModel.save().then(
      function success () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_ADD_SUCCESS,
          options: {
            sectionName: sectionName,
            optionName: optionName,
            newValue: value
          }
        });
      },
      function failure () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_ADD_FAILURE,
          options: { optionName: optionName, sectionName: sectionName }
        });
      }
    );
  },

  deleteOption: function (node, sectionName, optionName) {
    FauxtonAPI.dispatch({
      type: ActionTypes.DELETING_OPTION,
      options: { optionName: optionName, sectionName: sectionName }
    });

    var optionModel = new Resources.OptionModel({
      node: node,
      sectionName: sectionName,
      optionName: optionName
    });

    optionModel.destroy().then(
      function success () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_DELETE_SUCCESS,
          options: { optionName: optionName, sectionName: sectionName }
        });
      },
      function failure () {
        FauxtonAPI.dispatch({
          type: ActionTypes.OPTION_DELETE_FAILURE,
          options: { optionName: optionName, sectionName: sectionName }
        });
      }
    );
  }
};
