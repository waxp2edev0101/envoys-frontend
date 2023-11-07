export default ({ app, store }, inject) => {

  /**
   * @type {{open({content?: *, color?: *}): void}}
   */
  app.$snackbar = {

    /**
     * @param content
     * @param color
     */
    open ({ content = '', color = '' }) {
      store.commit('snackbar/open', { content, color })
    }
  };
  inject('snackbar', app.$snackbar);
}
