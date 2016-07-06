var ConfigStore = FauxtonAPI.Store.extend({
  initialize: function () {
    this.reset();
  },
  
  reset: function () {
    this._sections = [];
    this._loading = false;
  }
  
  
})