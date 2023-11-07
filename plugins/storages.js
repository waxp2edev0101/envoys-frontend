export default (app, inject) => {

  /**
   * @param path
   * @param name
   * @returns {`${string}/storage/${*}/${string}.png`}
   */
  app.$storages = (path, name) => {
    return `${app.$axios.defaults.baseURL}/v2/storage/${path.join('/')}/${name}.png`
  }
  inject('storages', app.$storages);
}
