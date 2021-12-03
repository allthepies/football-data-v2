//const axios = require('axios');
const fetch = require('node-fetch');

const Agent = require('agentkeepalive');

const httpKeepAliveAgent = new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 40000, // active socket keepalive for 60 seconds
    freeSocketTimeout: 20000, // free socket keepalive for 30 seconds
});

const httpsKeepAliveAgent = new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 40000, // active socket keepalive for 60 seconds
    freeSocketTimeout: 20000, // free socket keepalive for 30 seconds
});


function deleteEmptyParams(query) {

    for (const param in query) {

        if (query[param] === undefined /* In case of undefined assignment */ ||
            query[param] === null ||
            query[param] === "") {
            delete query[param];
        }
    }

    return query;
}

function requestParams(params) {

    const searchParams = new URLSearchParams(deleteEmptyParams(params));
    return searchParams.toString();
}


function fetchTimeout(url, options = {}, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject("timeout"), timeout)),
    ])
}


class FootballData {



    constructor(token, timeout = 1000) {
        this.token = token;
        this.timeout = timeout;
        /*
        this.instance = axios.create({
            baseURL: 'http://api.football-data.org/v2/',
            timeout: timeout,
            headers: {
                'X-Auth-Token': token
            },
            httpAgent: httpKeepAliveAgent,
            httpsAgent: httpsKeepAliveAgent
        });
        */
    }

    competitions({
        area,
        plan
    } = {}) {

        return fetchTimeout(`/competitions?${requestParams({
            areas: area,
            plan
        })}`)
    }

    competition(competitionId) {
        return fetchTimeout(`/competitions/${competitionId}`)
    }

    teams(competitionId, {
        season,
        stage
    } = {}) {

        return fetchTimeout(`/competitions/${competitionId}/teams?${requestParams({
            season,
            stage
        })}`)
    }

    standings(competitionId, {
        standingType
    } = {}) {

        return fetchTimeout(`/competitions/${competitionId}/standings?${requestParams({
            standingType
        })}`)
    }

    competitionMatches(competitionId, {
        dateFrom,
        dateTo,
        stage,
        status,
        matchday,
        group,
        season
    } = {}) {

        return fetchTimeout(`/competitions/${competitionId}/matches?${requestParams({
            dateFrom,
            dateTo,
            stage,
            status,
            matchday,
            group,
            season
        })}`)
    }

    matches({
        competitions,
        dateFrom,
        dateTo,
        status
    } = {}) {

        return fetchTimeout(`/matches?${requestParams({
            competitions,
            dateFrom,
            dateTo,
            status
        })}`)
    }

    match(id) {
        return this.instance.get(`/matches/${id}`)
    }

    teamMatches(id, {
        dateFrom,
        dateTo,
        status,
        venue,
        limit
    } = {}) {

        return fetchTimeout(`/teams/${id}/matches?${requestParams({
            dateFrom,
            dateTo,
            status,
            venue,
            limit
        })}`)
    }

    team(id) {
        return fetchTimeout(`/teams/${id}`)
    }

    areas(id) {
        return fetchTimeout(`/areas/${id}`)
    }

    player(id) {
        return fetchTimeout(`/player/${id}`)
    }

    playerMatches(id, {
        competitions,
        dateFrom,
        dateTo,
        status,
        limit
    } = {}) {

        return fetchTimeout(`/players/${id}/matches?${requestParams({
            competitions,
            dateFrom,
            dateTo,
            status,
            limit
        })}`)
    }

    scorers(competitionId, {
        limit,
        season
    } = {}) {

        return fetchTimeout(`/competitions/${competitionId}/scorers?${requestParams({
            limit,
            season
        })}`)
    }


}

module.exports = FootballData;