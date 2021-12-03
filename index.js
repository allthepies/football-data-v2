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



    constructor(token, timeout = 5000) {
        this.token = token;
        this.timeout = timeout;
        this.baseURL = 'http://api.football-data.org/v2/';

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

        return fetchTimeout(`${this.baseURL}/competitions?${requestParams({
            areas: area,
            plan
        })}`, {}, this.timeout);
    }

    competition(competitionId) {
        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}`)
    }

    teams(competitionId, {
        season,
        stage
    } = {}) {

        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/teams?${requestParams({
            season,
            stage
        })}`, {}, this.timeout);
    }

    standings(competitionId, {
        standingType
    } = {}) {

        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/standings?${requestParams({
            standingType
        })}`, {}, this.timeout);
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

        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/matches?${requestParams({
            dateFrom,
            dateTo,
            stage,
            status,
            matchday,
            group,
            season
        })}`, {}, this.timeout);
    }

    matches({
        competitions,
        dateFrom,
        dateTo,
        status
    } = {}) {

        return fetchTimeout(`${this.baseURL}/matches?${requestParams({
            competitions,
            dateFrom,
            dateTo,
            status
        })}`, {}, this.timeout);
    }

    match(id) {
        return fetchTimeout(`${this.baseURL}/matches/${id}`, {}, this.timeout);
    }

    teamMatches(id, {
        dateFrom,
        dateTo,
        status,
        venue,
        limit
    } = {}) {

        return fetchTimeout(`${this.baseURL}/teams/${id}/matches?${requestParams({
            dateFrom,
            dateTo,
            status,
            venue,
            limit
        })}`, {}, this.timeout);
    }

    team(id) {
        return fetchTimeout(`${this.baseURL}/teams/${id}`, {}, this.timeout);
    }

    areas(id) {
        return fetchTimeout(`${this.baseURL}/areas/${id}`, {}, this.timeout);
    }

    player(id) {
        return fetchTimeout(`${this.baseURL}/player/${id}`, {}, this.timeout);
    }

    playerMatches(id, {
        competitions,
        dateFrom,
        dateTo,
        status,
        limit
    } = {}) {

        return fetchTimeout(`${this.baseURL}/players/${id}/matches?${requestParams({
            competitions,
            dateFrom,
            dateTo,
            status,
            limit
        })}`, {}, this.timeout);
    }

    scorers(competitionId, {
        limit,
        season
    } = {}) {

        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/scorers?${requestParams({
            limit,
            season
        })}`, {}, this.timeout);
    }


}

module.exports = FootballData;