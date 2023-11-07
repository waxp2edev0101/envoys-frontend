export const state = () => ({
  content: '',
  color: ''
});

export const mutations = {
  open (state, payload) {
    state.content = payload.content;
    state.color = payload.color;
  }
};
