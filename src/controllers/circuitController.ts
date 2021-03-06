import { Circuit } from './../models/circuit';
import { Request, Response } from "express";

const httpRequest = require('request');
const cheerio = require('cheerio');

export class CircuitController {

    public getCircuit(req: Request, res: Response){
        let lang = req.query.lang ? req.query.lang : 'en';
        let circuit: String = req.params.circuit ? req.params.circuit : 'ITALY';

        var options = {
            url: 'http://www.motogp.com/' + lang + '/event/' + circuit,
            method: 'GET',
        };

        httpRequest(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body);
                try {
                    let name = $('h1#circuit_title').text();
                    let href_extra = $('div.c-event__destination-guide iframe').attr('src');
                    let autodrome = $('div.circuit_subtitle').first().text();
                    let nation = $('div.circuit_subtitle').last().text();
                    let length_euro = '';
                    let length_anglo = '';
                    let corner_left = '';
                    let corner_right = '';
                    let width_euro = '';
                    let width_anglo = '';
                    let longstraight_euro = '';
                    let longstraight_anglo = '';
                    $('div.circuit_number_container').each(function (i, elm) {    
                        switch (i) { //($(this).find('div.circuit_number_title').text())
                            case 0: { //'LENGTH'
                                length_euro = $(this).find('div.circuit_number_content').attr('data-units-euro');
                                length_anglo = $(this).find('div.circuit_number_content').attr('data-units-anglo');
                                break;
                            }
                            case 1: { //'CORNER'
                                $(this).find('div.circuit_number_content').each(function(j,val){
                                    switch (j) {
                                        case 0: {
                                            corner_left = $(this).text();
                                            break;
                                        }
                                        case 1: {
                                            corner_right = $(this).text();
                                            break;
                                        }
                                    }
                                });
                                break;
                            }
                            case 2: { //'WIDTH'
                                width_euro = $(this).find('div.circuit_number_content').attr('data-units-euro');
                                width_anglo = $(this).find('div.circuit_number_content').attr('data-units-anglo');
                                break;
                            }
                            case 3: { //'LONG STRAIGHT'
                                longstraight_euro = $(this).find('div.circuit_number_content').attr('data-units-euro');
                                longstraight_anglo = $(this).find('div.circuit_number_content').attr('data-units-anglo');
                                break;
                            }
                        }
                    });
                    let image_circuit = $('img.img-responsive.track').attr('src');
                    let short_description = $('div.c-event__circuit-description').text();
                    let date = $('div.event-date__date').first().text();
                    let air_temp = $('span.weather__info__temp--air div.temp__value').text();
                    let ground_temp = $('span.weather__info__temp--ground div.temp__value').text();
                    let motopg_laps = 0;
                    let moto2_laps = 0;
                    let moto3_laps = 0;
                    let motogp_tot_dist = '';
                    let moto2_tot_dist = '';
                    let moto3_tot_dist = '';
                    $('div.c-laps__item').each(function (i, elm) {
                        switch (i) { 
                            case 1: { 
                                motopg_laps = $(this).text();
                                break;
                            }
                            case 2: { 
                                moto2_laps = $(this).text();
                                break;
                            }
                            case 3: { 
                                moto3_laps = $(this).text();
                                break;
                            }
                            case 9: {
                                motogp_tot_dist = $(this).text();
                                break;
                            }
                            case 10: {
                                moto2_tot_dist = $(this).text();
                                break;
                            }
                            case 11: {
                                moto3_tot_dist = $(this).text();
                                break;
                            }
                        }
                    });

                    let circuit = new Circuit(
                        name, nation, autodrome,
                        date, air_temp, ground_temp, short_description,
                        length_euro, length_anglo,
                        corner_left, corner_right,
                        width_euro, width_anglo,
                        longstraight_euro, longstraight_anglo,
                        image_circuit,
                        motopg_laps, moto2_laps, moto3_laps,
                        motogp_tot_dist, moto2_tot_dist, moto3_tot_dist
                    );

                    $('div[data-tab=c-event__category-info__motogp] div.most-wins li').each(function (i, elm) {
                        let rider_name = $(this).find('div.most-wins__rider-name').text();
                        let rider_number = $(this).find('div.most-wins__rider-number').text();
                        let value = $(this).find('div.most-wins__data-value').text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMotoGpMostWins(rider_name, rider_number, value);
                    });
                    $('div[data-tab=c-event__category-info__moto2] div.most-wins li').each(function (i, elm) {
                        let rider_name = $(this).find('div.most-wins__rider-name').text();
                        let rider_number = $(this).find('div.most-wins__rider-number').text();
                        let value = $(this).find('div.most-wins__data-value').text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMoto2MostWins(rider_name, rider_number, value);
                    });
                    $('div[data-tab=c-event__category-info__moto3] div.most-wins li').each(function (i, elm) {
                        let rider_name = $(this).find('div.most-wins__rider-name').text();
                        let rider_number = $(this).find('div.most-wins__rider-number').text();
                        let value = $(this).find('div.most-wins__data-value').text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMoto3MostWins(rider_name, rider_number, value);
                    });
                    $('div[data-tab=c-event__category-info__motogp] div.most-poles li').each(function (i, elm) {
                        let rider_name = $(this).find('div.most-poles__rider-name').text();
                        let rider_number = $(this).find('div.most-poles__rider-number').text();
                        let value = $(this).find('div.most-poles__data-value').text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMotoGpMostPoles(rider_name, rider_number, value);
                    });
                    $('div[data-tab=c-event__category-info__moto2] div.most-poles li').each(function (i, elm) {
                        let rider_name = $(this).find('div.most-poles__rider-name').text();
                        let rider_number = $(this).find('div.most-poles__rider-number').text();
                        let value = $(this).find('div.most-poles__data-value').text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMoto2MostPoles(rider_name, rider_number, value);
                    });
                    $('div[data-tab=c-event__category-info__moto3] div.most-poles li').each(function (i, elm) {
                        let rider_name = $(this).find('div.most-poles__rider-name').text();
                        let rider_number = $(this).find('div.most-poles__rider-number').text();
                        let value = $(this).find('div.most-poles__data-value').text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMoto3MostPoles(rider_name, rider_number, value);
                    });

                    $('div[data-tab=c-event__category-info__motogp] div.circuit-records li').each(function (i, elm) {
                        let type = $(this).find('div.circuit-records__title_container div.circuit-records__subtitle').text();
                        let season = $(this).find('div.circuit-records__title_container div.circuit-records__season').text();
                        let rider_name = $(this).find('div.circuit-records__rider_name').text();
                        let rider_team = $(this).find('div.circuit-records__rider_team').text();
                        let rider_number = $(this).find('div.circuit-records__rider_number').text();
                        let time = $(this).find('div.circuit-records__value').first().text();
                        let value = $(this).find('div.circuit-records__value').last().text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMotoGpRecords(type, season, rider_name, rider_number, rider_team, time, value);
                    });

                    $('div[data-tab=c-event__category-info__moto2] div.circuit-records li').each(function (i, elm) {
                        let type = $(this).find('div.circuit-records__title_container div.circuit-records__subtitle').text();
                        let season = $(this).find('div.circuit-records__title_container div.circuit-records__season').text();
                        let rider_name = $(this).find('div.circuit-records__rider_name').text();
                        let rider_team = $(this).find('div.circuit-records__rider_team').text();
                        let rider_number = $(this).find('div.circuit-records__rider_number').text();
                        let time = $(this).find('div.circuit-records__value').first().text();
                        let value = $(this).find('div.circuit-records__value').last().text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMoto2Records(type, season, rider_name, rider_number, rider_team, time, value);
                    });

                    $('div[data-tab=c-event__category-info__moto3] div.circuit-records li').each(function (i, elm) {
                        let type = $(this).find('div.circuit-records__title_container div.circuit-records__subtitle').text();
                        let season = $(this).find('div.circuit-records__title_container div.circuit-records__season').text();
                        let rider_name = $(this).find('div.circuit-records__rider_name').text();
                        let rider_team = $(this).find('div.circuit-records__rider_team').text();
                        let rider_number = $(this).find('div.circuit-records__rider_number').text();
                        let time = $(this).find('div.circuit-records__value').first().text();
                        let value = $(this).find('div.circuit-records__value').last().text();
                        // console.log(rider_name+" "+rider_number);
                        circuit.addMoto3Records(type, season, rider_name, rider_number, rider_team, time, value);
                    });

                    res.json(circuit);
                } catch (exeption) {
                    console.log(exeption);
                    res.sendStatus(503);
                }
            };
        });

    }
}