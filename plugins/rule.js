export default ({ app }, inject) => {

  /**
   * @type {{get(*): boolean}}
   */
  app.$rule = {

    /**
     * @param name
     * @returns {boolean}
     */
    get(name) {
      return !!app.$auth.user.rules.find((item) => item === name);
    }
  };
  inject('rule', app.$rule);
};
