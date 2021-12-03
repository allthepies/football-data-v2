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
        this.headers = {
            'X-Auth-Token': token
        };

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
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/competitions?${requestParams({
            areas: area,
            plan
        })}`, {
            headers
        }, this.timeout);
    }

    competition(competitionId) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}`, {
            headers
        }, this.timeout);
    }

    teams(competitionId, {
        season,
        stage
    } = {}) {
        const headers = this.headers;

        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/teams?${requestParams({
            season,
            stage
        })}`, {
            headers
        }, this.timeout);
    }

    standings(competitionId, {
        standingType
    } = {}) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/standings?${requestParams({
            standingType
        })}`, {
            headers
        }, this.timeout);
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
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/matches?${requestParams({
            dateFrom,
            dateTo,
            stage,
            status,
            matchday,
            group,
            season
        })}`, {
            headers
        }, this.timeout);
    }

    matches({
        competitions,
        dateFrom,
        dateTo,
        status
    } = {}) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/matches?${requestParams({
            competitions,
            dateFrom,
            dateTo,
            status
        })}`, {
            headers
        }, this.timeout);
    }

    match(id) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/matches/${id}`, {
            headers
        }, this.timeout);
    }

    teamMatches(id, {
        dateFrom,
        dateTo,
        status,
        venue,
        limit
    } = {}) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/teams/${id}/matches?${requestParams({
            dateFrom,
            dateTo,
            status,
            venue,
            limit
        })}`, {
            headers
        }, this.timeout);
    }

    team(id) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/teams/${id}`, {
            headers
        }, this.timeout);
    }

    areas(id) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/areas/${id}`, {
            headers
        }, this.timeout);
    }

    player(id) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/player/${id}`, {
            headers
        }, this.timeout);
    }

    playerMatches(id, {
        competitions,
        dateFrom,
        dateTo,
        status,
        limit
    } = {}) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/players/${id}/matches?${requestParams({
            competitions,
            dateFrom,
            dateTo,
            status,
            limit
        })}`, {
            headers
        }, this.timeout);
    }

    scorers(competitionId, {
        limit,
        season
    } = {}) {
        const headers = this.headers;
        return fetchTimeout(`${this.baseURL}/competitions/${competitionId}/scorers?${requestParams({
            limit,
            season
        })}`, {
            headers
        }, this.timeout);
    }


}

module.exports = FootballData;