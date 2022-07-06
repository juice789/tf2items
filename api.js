const axios = require('axios')
const { compose, __, map, applyTo, prop } = require('ramda')

const myAxios = axios.create()

myAxios.interceptors.response.use(prop('data'), Promise.reject.bind(Promise))

const api = {}

api.getSchemaItems = ({ steamApiKey: key }) => (start) => myAxios({
    method: 'get',
    url: `https://api.steampowered.com/IEconItems_440/GetSchemaItems/v1/`,
    params: {
        key,
        language: 'EN',
        start
    }
})

api.getSchemaOverview = ({ steamApiKey: key }) => () => myAxios({
    method: 'get',
    url: `https://api.steampowered.com/IEconItems_440/GetSchemaOverview/v1/`,
    params: {
        key,
        language: 'EN'
    }
})

api.getItemsGameUrl = ({ steamApiKey: key }) => () => myAxios({
    method: 'get',
    url: `https://api.steampowered.com/IEconItems_440/GetSchemaURL/v1/`,
    params: {
        key
    }
})

api.getItemsGame = () => (url) => myAxios({
    method: 'get',
    url
})

api.fetchTfEnglish = () => () => myAxios({
    method: 'get',
    url: `https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/resource/tf_english.txt`
})

api.fetchProtoObjDefs = () => () => myAxios({
    method: 'get',
    url: `https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/resource/tf_proto_obj_defs_english.txt`
})

const createApi = compose(map(__, api), applyTo)

module.exports = createApi