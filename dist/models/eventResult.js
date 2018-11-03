"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class eventResult {
    constructor(esercizio, name, category, session) {
        this.esercizio = esercizio;
        this.name = name;
        this.category = category;
        this.session = session;
    }
    addRanking(rider_name, rider_num, rider_team, rider_nation, bike, position, speed, time_gap, points) {
        let rank = {
            rider_name: rider_name,
            rider_num: rider_num,
            rider_team: rider_team,
            rider_nation: rider_nation,
            bike: bike,
            position: position,
            points: points,
            speed: speed,
            time_gap: time_gap,
        };
        if (!this.ranking) {
            this.ranking = [];
        }
        this.ranking.push(rank);
    }
    addWeather(air_temp, ground_temp, humidity, track_condition) {
        this.weather = {
            air_temp: air_temp.substr(air_temp.indexOf(':') + 1),
            ground_temp: ground_temp.substr(ground_temp.indexOf(':') + 1),
            humidity: humidity.substr(humidity.indexOf(':') + 1),
            track_condition: track_condition.substr(track_condition.indexOf(':') + 1),
        };
    }
    addRecords(type, detail, rider_name, speed, time) {
        let record = {
            type: type,
            detail: detail,
            rider_name: rider_name,
            speed: speed,
            time: time,
        };
        if (!this.records) {
            this.records = [];
        }
        this.records.push(record);
    }
}
exports.eventResult = eventResult;
//# sourceMappingURL=eventResult.js.map