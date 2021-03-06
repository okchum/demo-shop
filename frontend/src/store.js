import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const body = document.getElementsByTagName('body')[0];
export default new Vuex.Store({
    state       :   {
        error       :   null,
        site_data   :   null,
        is_loading  :   true,
        is_mobile   :   false,
        page_lang   :   document.documentElement.lang.replace(/\-/gi, '_'),
        locale      :   body.dataset.preferredlang,
        width       :   window.innerWidth,
        offset      :   0
    },
    mutations   :   {
        clear_error(state)
        {
            state.error     =   null;
        },
        set_error(state, data)
        {
            state.error     =   data;
        },
        update_data(state, data)
        {
            state.site_data     =   data;
            if (!data) {
                state.is_loading    =   true;
            } else {
                console.log(data.locale);
                state.page_lang = data.locale;
                setTimeout(function () {
                    state.is_loading    =   false;
                }, 100);
            }
        },
        updateLocale(state, lang)
        {
            state.locale = lang;
        },
        toggle_loading(state, loading)
        {
            state.is_loading    =   loading;
        }
    },
    actions: {
        get_page_data({ commit }, path)
        {
            commit('clear_error');
            commit('update_data', null);
            return new Promise((resolve, reject) => {
                axios.get(path).then((resp) => {
                    commit('update_data', resp.data);
                    resolve();
                }).catch((error) => {
                    commit('set_error', error);
                    let code    =   404;
                    if (error.response && error.response.status && error.response.data) {
                        code    =   error.response.status;
                        commit('update_data', error.response.data);
                    }

                    this.dispatch('get_error_page', code);
                });
            });
        },
        get_error_page({ commit }, error_code, resolve)
        {
            axios.get(base_url + error_code).catch((error) => {
                if (error.response && error.reponse.data) {
                    commit('update_data', error.response.data);
                }
            });
        },
        SwitchLang({ commit }, lang) {
            return new Promise((resolve, reject) => {
                axios.post(base_url + `api/v/1/session`, lang).then(resp => {
                    commit('updateLocale', resp.data);
                    resolve(resp);
                }).catch(reject);
            });
        }
    }
});
